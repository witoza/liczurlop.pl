function is_real_backend() {
	return false;
}

var BACKEND = {}

BACKEND["wito"] = {
	meta : {
		uid : "wito",
		username : "witold z",
		locale : "pl",
		created_time : new Date(),
		last_updated_time : null,
		last_updated_ip : null,
	},
	country : "poland",
	callendar_begin : "01/01/2015",
	callendar_end	: "02/01/2016",
	opts : {
		leave_days : 39,
		from : null,
		to : "12/31/2015",
		start_in_the_mid_week :	false,
		finish_in_the_mid_week : false,
		holiday_on_sat_extends_holiday : true,
		do_not_overlap_with_blacklist_days : true
	},
	holidays_taken : [
		{
			type : "holiday",
			from : "1/1/2015",
			to : "1/3/2015",
			comment : "Rybka lubi plywac",
			unpaid : false,
			on_demand : false,
			show : true
		},
		{
			type : "holiday",
			from : "1/14/2015",
			to : "2/18/2015",
			comment : "Wyjazd do Afganistanu",
			unpaid : true,
			on_demand : false,
			show : false
		},
		{
			type : "holiday",
			from : "4/14/2015",
			to :  "4/14/2015",
			comment : "Urlop na zadanie. Chlanie ze Zbyszkiem",
			unpaid : false,
			on_demand : true,
			show : true
		},
		{
			type : "blacklist",
			from : "07/11/2015",
			to : "07/12/2015",
			comment : "Ślub Marka i Iwony",
			show : true
		},
		{
			type : "blacklist",
			from : "08/18/2015",
			to : "08/18/2015",
			comment : "Imieniny Taty",
			show : true
		}
	],
	show_blacklist_days : true,
	selected_drange : null,
	selected_leave_days : 20
};

function backend_remove_user(uid, callback) {
	console.log("backend_remove_user", uid);
	delete BACKEND[uid];
	window.location.href = window.location.pathname;
}

function backend_save_user(uid, user_data, callback) {
	console.log("backend_save_user", uid);

	setTimeout(function() {
		if (uid === "anonymous") {
			uid = "wito-1"
			window.location.href = window.location.pathname +"?"+uid;
		} else {
			BACKEND[uid] = user_data;
		}
	}, 50);
}

function backend_get_user(uid, callback) {

	function user_data_default(uid) {
		return {
			meta : {
				uid : uid,
				username : null,
				created_time : new Date(),
				last_updated_time : null,
				last_updated_ip : null,
			},
			country : "uk",
			callendar_begin : "01/01/2016",
			callendar_end	: "02/01/2017",
			opts : {
				leave_days : 26,
				from : null,
				to : "12/31/2015",
				start_in_the_mid_week :	false,
				finish_in_the_mid_week : false,
				holiday_on_sat_extends_holiday : true,
				do_not_overlap_with_blacklist_days : true
			},
			holidays_taken : [],
			show_blacklist_days : true,
			selected_drange : null,
			selected_leave_days : 15
		};
	}

	console.log("backend_get_user", uid);
	setTimeout(function() {
		if (BACKEND[uid] === undefined) {
			callback(user_data_default(uid));
		} else {
			callback(BACKEND[uid]);
		}
	}, 50);

}
