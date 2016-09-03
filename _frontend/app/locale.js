const public_holidays = [
    {date: new Date("1/1/2016").getTime(), name: "Nowy Rok, Świetej Bożej Rodzicielki"},
    {date: new Date("1/6/2016").getTime(), name: "Trzech Króli (Objawienie Pańskie)"},
    {date: new Date("3/27/2016").getTime(), name: "Wielkanoc"},
    {date: new Date("3/28/2016").getTime(), name: "Poniedzialek Wielkanocny"},
    {date: new Date("5/1/2016").getTime(), name: "Święto Pracy"},
    {date: new Date("5/3/2016").getTime(), name: "Święto Konstytucji 3 Maja"},
    {date: new Date("5/15/2016").getTime(), name: "Zesłanie Ducha Swietego (Zielone Swiatki)"},
    {date: new Date("5/26/2016").getTime(), name: "Boże Ciało"},
    {date: new Date("8/15/2016").getTime(), name: "Święto Wojska Polskiego, Wniebowziecie Najswietszej Maryi Panny"},
    {date: new Date("11/1/2016").getTime(), name: "Wszystkich Świetych"},
    {date: new Date("11/11/2016").getTime(), name: "Święto Niepodleglosci"},
    {date: new Date("12/25/2016").getTime(), name: "Boże Narodzenie (pierwszy dzień)"},
    {date: new Date("12/26/2016").getTime(), name: "Boże Narodzenie (drugi dzień)"},

    {date: new Date("1/1/2017").getTime(), name: "Nowy Rok, Świetej Bożej Rodzicielki"},
    {date: new Date("1/6/2017").getTime(), name: "Trzech Króli (Objawienie Pańskie)"},
    {date: new Date("4/16/2017").getTime(), name: "Wielkanoc"},
    {date: new Date("4/17/2017").getTime(), name: "Poniedzialek Wielkanocny"},
    {date: new Date("5/1/2017").getTime(), name: "Święto Pracy"},
    {date: new Date("5/3/2017").getTime(), name: "Święto Konstytucji 3 Maja"},
    {date: new Date("6/4/2017").getTime(), name: "Zesłanie Ducha Swietego (Zielone Swiatki)"},
    {date: new Date("6/15/2017").getTime(), name: "Boże Ciało"},
    {date: new Date("8/15/2017").getTime(), name: "Święto Wojska Polskiego, Wniebowziecie Najswietszej Maryi Panny"},
    {date: new Date("11/1/2017").getTime(), name: "Wszystkich Świetych"},
    {date: new Date("11/11/2017").getTime(), name: "Święto Niepodleglosci"},
    {date: new Date("12/25/2017").getTime(), name: "Boże Narodzenie (pierwszy dzień)"},
    {date: new Date("12/26/2017").getTime(), name: "Boże Narodzenie (drugi dzień)"}
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
