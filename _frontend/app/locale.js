function get_country(country) {
	function get_country_id(country) {
		for (var i = 0; i < C.length; ++i) {
			if (C[i].code == country) {
				return i;
			}
		}
	}
	return C[get_country_id(country)]
}

function browser_locale() {
	return window.navigator.userLanguage || window.navigator.language;
}

var COUNTRIES_REDEFINE = {
	"poland" : {
		public_holidays : [
			{date: new Date("1/1/2015").getTime(), name : "Nowy Rok, Swietej Bozej Rodzicielki"},
			{date: new Date("1/6/2015").getTime(), name : "Trzech Króli (Objawienie Panskie)"},
			{date: new Date("4/5/2015").getTime(), name : "Wielkanoc"},
			{date: new Date("4/6/2015").getTime(), name : "Poniedzialek Wielkanocny"},
			{date: new Date("5/1/2015").getTime(), name : "Swieto Pracy"},
			{date: new Date("5/3/2015").getTime(), name : "Swieto Konstytucji 3 Maja"},
			{date: new Date("5/24/2015").getTime(), name : "Zeslanie Ducha Swietego (Zielone Swiatki)"},
			{date: new Date("6/4/2015").getTime(), name : "Boze Cialo"},
			{date: new Date("8/15/2015").getTime(), name : "Swieto Wojska Polskiego, Wniebowziecie Najswietszej Maryi Panny"},
			{date: new Date("11/1/2015").getTime(), name : "Wszystkich Swietych"},
			{date: new Date("11/11/2015").getTime(), name : "Swieto Niepodleglosci"},
			{date: new Date("12/25/2015").getTime(), name : "Boze Narodzenie (pierwszy dzien)"},
			{date: new Date("12/26/2015").getTime(), name : "Boze Narodzenie (drugi dzien)"},
			
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
		]
	}
};

var TRANSLATE = {
	"pl" : {
		translate : function(what) {
			if (what == "Edit Blacklist days") return "Edytuj wpis na Czarnej liście";
			if (what == "new Blacklist Days") return "nowy wpis na Czarną liste";
			if (what == "Blacklist days") return "Czarna lista";
			if (what == "Add new Blacklist days") return "Dodaj nowy wpis na Czarną liste";
			if (what == "It is in ") return "To za ";
			if (what == "Starts in the past") return "Początek w przeszłości";
			if (what == "It is tommorow!") return "To już jutro!";
			if (what == "Calendar") return "Kalendarz";
			if (what == "Possible dates") return "Możliwe terminy";
			if (what == "Export as JSON") return "Eksport jako JSON";
			if (what == "Import from JSON") return "Import z JSON";
			if (what == "Search flight in ") return "Szukaj lotu w ";
			if (what == "day") return "dzień";
			if (what == "days") return "dni";
			if (what == "Total days taken") return "Liczba wykorzystanych dni";
			if (what == "Add") return "Dodaj";
			if (what == "Add as a ") return "Dodaj jako ";
			if (what == "Leave days") return "Urlopy";
			if (what == "new Leave Days") return "nowy Urlop";
			if (what == "Edit Leave days") return "Edytuj urlop";
			if (what == "Add new Leave days") return "Dodaj nowy urlop";
			if (what == "Psst, use button above to add new Holiday.") return "Psst, użyj przycisku powyżej , aby dodać nowy urlop.";

			return what+"/NEED TRANSLATE";
		}
	}
};

var LANGS = [
	{lang: "afrikaans", code: "af"}, 
	{lang: "moroccan arabic", code: "ar-ma"}, 
	{lang: "arabic saudi arabia", code: "ar-sa"}, 
	{lang: "tunisian arabic", code: "ar-tn"}, 
	{lang: "arabic", code: "ar"}, 
	{lang: "azerbaijani", code: "az"}, 
	{lang: "belarusian", code: "be"}, 
	{lang: "bulgarian", code: "bg"}, 
	{lang: "bengali", code: "bn"}, 
	{lang: "tibetan", code: "bo"}, 
	{lang: "breton", code: "br"}, 
	{lang: "bosnian", code: "bs"}, 
	{lang: "catalan", code: "ca"}, 
	{lang: "czech", code: "cs"}, 
	{lang: "chuvash", code: "cv"}, 
	{lang: "welsh", code: "cy"}, 
	{lang: "danish", code: "da"}, 
	{lang: "austrian german", code: "de-at"}, 
	{lang: "german", code: "de"}, 
	{lang: "modern greek", code: "el"}, 
	{lang: "australian english", code: "en-au"}, 
	{lang: "canadian english", code: "en-ca"}, 
	{lang: "great britain english", code: "en-gb"}, 
	{lang: "english", code: "en-gb"}, 
	{lang: "esperanto", code: "eo"}, 
	{lang: "spanish", code: "es"}, 
	{lang: "estonian", code: "et"}, 
	{lang: "euskara", code: "eu"}, 
	{lang: "persian", code: "fa"}, 
	{lang: "finnish", code: "fi"}, 
	{lang: "faroese", code: "fo"}, 
	{lang: "canadian french", code: "fr-ca"}, 
	{lang: "french", code: "fr"}, 
	{lang: "frisian", code: "fy"}, 
	{lang: "galician", code: "gl"}, 
	{lang: "hebrew", code: "he"}, 
	{lang: "hindi", code: "hi"}, 
	{lang: "hrvatski", code: "hr"}, 
	{lang: "hungarian", code: "hu"}, 
	{lang: "armenian", code: "hy-am"}, 
	{lang: "bahasa indonesia", code: "id"}, 
	{lang: "icelandic", code: "is"}, 
	{lang: "italian", code: "it"}, 
	{lang: "japanese", code: "ja"}, 
	{lang: "georgian", code: "ka"}, 
	{lang: "khmer", code: "km"}, 
	{lang: "korean", code: "ko"}, 
	{lang: "luxembourgish", code: "lb"}, 
	{lang: "lithuanian", code: "lt"}, 
	{lang: "latvian", code: "lv"}, 
	{lang: "macedonian", code: "mk"}, 
	{lang: "malayalam", code: "ml"}, 
	{lang: "marathi", code: "mr"}, 
	{lang: "bahasa malaysia", code: "ms-MY"}, 
	{lang: "burmese", code: "my"}, 
	{lang: "norwegian bokmăąl", code: "nb"}, 
	{lang: "dutch", code: "nl"}, 
	{lang: "norwegian nynorsk", code: "nn"}, 
	{lang: "polish", code: "pl"}, 
	{lang: "brazilian portuguese", code: "pt-br"}, 
	{lang: "portuguese", code: "pt"}, 
	{lang: "romanian", code: "ro"}, 
	{lang: "russian", code: "ru"}, 
	{lang: "slovak", code: "sk"}, 
	{lang: "slovenian", code: "sl"}, 
	{lang: "albanian", code: "sq"}, 
	{lang: "serbian-cyrillic", code: "sr-cyrl"}, 
	{lang: "serbian-latin", code: "sr"}, 
	{lang: "swedish", code: "sv"}, 
	{lang: "tamil", code: "ta"}, 
	{lang: "thai", code: "th"}, 
	{lang: "tagalog/filipino", code: "tl-ph"}, 
	{lang: "turkish", code: "tr"}, 
	{lang: "morocco central atlas tamaziéłt in latin", code: "tzm-latn"}, 
	{lang: "morocco central atlas tamaziéłt", code: "tzm"}, 
	{lang: "ukrainian", code: "uk"}, 
	{lang: "uzbek", code: "uz"}, 
	{lang: "vietnamese", code: "vi"}, 
	{lang: "chinese", code: "zh-cn"}, 
	{lang: "traditional chinese", code: "zh-tw"}
];
