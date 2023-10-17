import groupBy from "lodash/groupBy";
import React, { useState } from "react";
import {
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  TimelineProps,
} from "react-native-calendars";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";
import { useQuery } from "react-query";
import { Layout } from "../../components/Layout";
import { Button, Input, Modal, ScrollView, Text, View } from "native-base";
import ReservationTypeWriter from "../../components/ReservationTypeWriter";

const today = new Date();
export const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(
    new Date().setDate(today.getDate() + offset)
  );


const INITIAL_TIME = { hour: 9, minutes: 0 };

const defaultTimeType = 'M';
const timeTypeMilliseconds: any = {
  m: {
    num: 60000
  },
  M: {
    num: 60000
  },
  H: {
    num: 3600000
  },
  h: {
    num: 3600000
  }
};
const validTimeTypes = ['m', 'M', 'h', 'H'];



export function Reservation({
  navigation,
}: {
  route: any;
  navigation: NativeStackNavigationProp<any>;
}) {
  const [currentDate, setCurrentDate] = useState(getDate());

  const [markedDates, setMarkedDates] = useState<{
    [key: string]: MarkingProps;
  }>({});

  const [eventsByDate, setEventsByDate] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<TimelineHourseProps | undefined>(undefined);
  const [reservationCommand, setReservationCommand] = useState<string>('');

  const { isLoading, error, data = {} } = useQuery(["repoData"], () =>
    axios.get(`/api/reservationSalle/reservations`).then((res) => {
      const { data } = res;
      const datas = data.map((reservation: any) => {
        return {
          key: reservation.reservationId,
          id: reservation.reservationId,
          start: reservation.beginDate,
          end: reservation.endDate,
          title: reservation.room.label,
          summary: `${reservation.ressource.lastName} ${reservation.ressource.firstName} ( ${reservation.reason})`,
          color: "pink",
        };
      });
      const groupedByDate = groupBy(datas, (e) =>
        CalendarUtils.getCalendarDateString(e.start)
      ) as {
        [key: string]: TimelineEventProps[];
      };
      setEventsByDate(groupedByDate);
      let markedDates: {
        [key: string]: MarkingProps;
      } = {};
      Object.keys(groupedByDate).forEach((date) => {
        markedDates[`${date}`] = { marked: true };
      });
      setMarkedDates(markedDates);
      return groupedByDate;
    })
  );

  const onDateChanged = (date: string) => {
    setCurrentDate(date);
  };

  const onMonthChange = (month: any, updateSource: any) => {
    console.log("TimelineCalendarScreen onMonthChange: ", month, updateSource);
  };

  const approveNewEvent: TimelineProps["onBackgroundLongPressOut"] = (
    timeString,
    timeObject
  ) => {
    setShowModal(true);
    setSelectedDate({ timeString, time: timeObject });
  };

  const timelineProps: Partial<TimelineProps> = {
    format24h: true,
    onBackgroundLongPressOut: approveNewEvent,

    unavailableHours: [
      { start: 0, end: 8 },
      { start: 19, end: 23 }
    ],
    overlapEventsSpacing: 8,
    rightEdgeSpacing: 24,
  };


  const handleReserve = () => {
    let timeType = reservationCommand[reservationCommand.length - 1];
    const isTimeTypeAssigned = validTimeTypes.includes(timeType)
    timeType = isTimeTypeAssigned ? timeType : defaultTimeType;
    const newReservationCommand = isTimeTypeAssigned ? reservationCommand.substr(0, reservationCommand.length - 1) : reservationCommand;

    if (!selectedDate
      || !selectedDate.time
      || !selectedDate.time.date
      || !reservationCommand
      || reservationCommand.length === 0) {
      return;
    }

    const timeObject = selectedDate.time;
    if (!newReservationCommand?.split(" ") || newReservationCommand?.split(" ").length < 2) {
      return;
    }
    const [salle, minutes, ...rest] = newReservationCommand?.split(" ");

    if (!timeObject?.date?.split("-") || timeObject?.date?.split("-").length < 3) {
      return;
    }
    const [year, mounth, day] = timeObject.date.split("-");
    const startDate = new Date(Number(year), Number(mounth), Number(day), timeObject.hour, timeObject.minutes, 0);
    const endDate = new Date(startDate.getTime() + Number(minutes) * timeTypeMilliseconds[timeType].num)

    const newEvent = {
      id: undefined,
      start: selectedDate.timeString,
      end: `${timeObject.date} ${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}:00`,
      title: `Salle ${salle}`,
      summary: 'marouane el merrouni',
      color: "lightgreen",
    };

    const eventsExistsForDate = eventsByDate[timeObject.date] ? true : false;
    if (eventsExistsForDate) {
      eventsByDate[timeObject.date] = [
        ...eventsByDate[timeObject.date],
        newEvent,
      ];
      setEventsByDate(eventsByDate);
    } else {
      eventsByDate[timeObject.date] = [newEvent];
      setEventsByDate({ ...eventsByDate });
    }
    setReservationCommand('');
    setShowModal(false);

  }

  return (
    <Layout title="Reservation" navigation={navigation} navigateTo="Home">
      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        <CalendarProvider
          date={currentDate}
          onDateChanged={onDateChanged}
          onMonthChange={onMonthChange}
          showTodayButton
          disabledOpacity={0.6}
        >
          <ExpandableCalendar
            firstDay={1}
            markedDates={markedDates}
          />
          <TimelineList
            events={eventsByDate}
            timelineProps={timelineProps}
            showNowIndicator
            scrollToFirst
            initialTime={INITIAL_TIME}
          />
        </CalendarProvider>
      </ScrollView>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="full">
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Body>
            <View style={{ height: 50 }}>
              <ReservationTypeWriter />
            </View>

            <Input size="xl" onChangeText={(command) => setReservationCommand(command)} value={reservationCommand} />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group>
              <Button width="full" style={{
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }} onPress={handleReserve}>
                <Text style={{
                  color: '#fff'
                }}>Save</Text>
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Layout>
  );
}

interface NewEventTime {
  hour: number;
  minutes: number;
  date?: string;
}
interface TimelineHourseProps {
  timeString: string,
  time: NewEventTime
}


export default Reservation;
