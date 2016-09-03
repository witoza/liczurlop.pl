const public_holidays = [
    {date: new Date("1/1/2016").getTime(), name: "Nowy Rok, Swietej Bozej Rodzicielki"},
    {date: new Date("1/6/2016").getTime(), name: "Trzech Króli (Objawienie Panskie)"},
    {date: new Date("3/27/2016").getTime(), name: "Wielkanoc"},
    {date: new Date("3/28/2016").getTime(), name: "Poniedzialek Wielkanocny"},
    {date: new Date("5/1/2016").getTime(), name: "Swieto Pracy"},
    {date: new Date("5/3/2016").getTime(), name: "Swieto Konstytucji 3 Maja"},
    {date: new Date("5/15/2016").getTime(), name: "Zeslanie Ducha Swietego (Zielone Swiatki)"},
    {date: new Date("5/26/2016").getTime(), name: "Boze Cialo"},
    {date: new Date("8/15/2016").getTime(), name: "Swieto Wojska Polskiego, Wniebowziecie Najswietszej Maryi Panny"},
    {date: new Date("11/1/2016").getTime(), name: "Wszystkich Swietych"},
    {date: new Date("11/11/2016").getTime(), name: "Swieto Niepodleglosci"},
    {date: new Date("12/25/2016").getTime(), name: "Boze Narodzenie (pierwszy dzien)"},
    {date: new Date("12/26/2016").getTime(), name: "Boze Narodzenie (drugi dzien)"}
];

const TRANSLATE = {
    "pl": {
        translate: function (what) {
            if (what == "Edit Blacklist days") return "Edytuj wpis na Czarnej liście";
            if (what == "new Blacklist Days") return "nowy wpis na Czarną liste";
            if (what == "Blacklist days") return "Czarna lista";
            if (what == "Add new Blacklist days") return "Dodaj nowy wpis na Czarną liste";
            if (what == "It is in ") return "To za ";
            if (what == "Starts in the past") return "Początek w przeszłości";
            if (what == "It is tommorow!") return "To już jutro!";
            if (what == "Calendar") return "Kalendarz";
            if (what == "Possible dates") return "Możliwe terminy";
            if (what == "day") return "dzień";
            if (what == "days") return "dni";
            if (what == "Total days taken") return "Liczba wykorzystanych dni";
            if (what == "Add") return "Dodaj";
            if (what == "Add as a ") return "Dodaj jako ";
            if (what == "Leave days") return "Urlopy";
            if (what == "new Leave Days") return "nowy Urlop";
            if (what == "Edit Leave days") return "Edytuj urlop";
            if (what == "Add new Leave days") return "Dodaj nowy urlop";

            return what + "/NEED TRANSLATE";
        }
    }
};
