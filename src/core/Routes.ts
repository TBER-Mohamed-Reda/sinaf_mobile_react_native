export const ROUTES = [
  {
    label: "home",
    icon: "home",
    permissions: ["Col", "Admin", "Formateur", "Pilote"],
  },
  {
    label: "leave",
    icon: "plane",
    permissions: ["Col", "Admin", "Formateur", "Pilote"],
    subItems: [
      {
        label: "requestLeave",
        icon: "plus",
        permissions: ["Col", "Admin", "Formateur", "Pilote"],
      },
      {
        label: "requestRight",
        icon: "legal",
        permissions: ["Col", "Admin", "Formateur", "Pilote"],
      },
    ],
  },
  {
    label: "formation",
    icon: "book",
    permissions: ["Col", "Admin", "Formateur", "Pilote"],
    subItems: [
      {
        label: "allFormations",
        icon: "list",
        permissions: ["Admin"]
      },
      {
        label: "myFormations",
        icon: "file",
        permissions: ["Col", "Admin", "Formateur", "Pilote"],
      },
      {
        label: "animatedFormations",
        icon: "laptop",
        permissions: ["Formateur"],
      }
    ],
  },
  {
    label: "administrativeFiles",
    icon: "folder",
    permissions: ["Col", "Admin", "Formateur", "Pilote"],
  },
  {
    label: "roomReservation",
    icon: "calendar",
    permissions: ["Col", "Admin", "Formateur", "Pilote"],
  },
];
