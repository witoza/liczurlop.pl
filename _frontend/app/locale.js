function browser_locale() {
	return window.navigator.userLanguage || window.navigator.language;
}

const public_holidays = [
    {date: new Date("1/1/2016").getTime(), name : "Nowy Rok, Swietej Bozej Rodzicielki"},
    {date: new Date("1/6/2016").getTime(), name : "Trzech Króli (Objawienie Panskie)"},
    {date: new Date("3/27/2016").getTime(), name : "Wielkanoc"},
    {date: new Date("3/28/2016").getTime(), name : "Poniedzialek Wielkanocny"},
    {date: new Date("5/1/2016").getTime(), name : "Swieto Pracy"},
    {date: new Date("5/3/2016").getTime(), name : "Swieto Konstytucji 3 Maja"},
    {date: new Date("5/15/2016").getTime(), name : "Zeslanie Ducha Swietego (Zielone Swiatki)"},
    {date: new Date("5/26/2016").getTime(), name : "Boze Cialo"},
    {date: new Date("8/15/2016").getTime(), name : "Swieto Wojska Polskiego, Wniebowziecie Najswietszej Maryi Panny"},
    {date: new Date("11/1/2016").getTime(), name : "Wszystkich Swietych"},
    {date: new Date("11/11/2016").getTime(), name : "Swieto Niepodleglosci"},
    {date: new Date("12/25/2016").getTime(), name : "Boze Narodzenie (pierwszy dzien)"},
    {date: new Date("12/26/2016").getTime(), name : "Boze Narodzenie (drugi dzien)"}
];
