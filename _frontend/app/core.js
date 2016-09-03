// is always
var user_data;
var moment_locale = moment.localeData("pl");
var moment_locale_en  = moment.localeData('en_GB');

function is_empty(str) {
    return str == null || str === undefined || str.trim() === "";
}

function translate(id) {
    return id;
}

function get_public_holidays() {
    return public_holidays;
}

Date.prototype.fmtMMDDYYYY = function () {
    return moment(this).format("MM/DD/YYYY");
}

function fmtMMDDYYYY(date) {
    if (date == null || date === "") return "";
    return date.fmtMMDDYYYY();
}

Date.prototype.is_saturday = function () {
    return this.getDay() == 6;
}

Date.prototype.is_sunday = function () {
    return this.getDay() === 0;
}

Date.prototype.is_a_mid_week = function () {
    var d = this.getDay();
    return d == 2 || d == 3 || d == 4;
}

Date.prototype.inc = function () {
    this.setDate(this.getDate() + 1);
}

Date.prototype.month_str = function () {
    return moment_locale.months(moment(this));
}

Date.prototype.get_holiday = function () {

    var public_holidays = get_public_holidays();

    var date_day_dt = this.getTime();
    for (var i = 0; i < public_holidays.length; ++i) {
        if (public_holidays[i].date == date_day_dt) {
            return public_holidays[i];
        }
        if (public_holidays[i].date > date_day_dt) {
            return null;
        }
    }
    return null;
}

Date.prototype.is_holiday = function () {
    return this.get_holiday() != null;
}

function iterate(start_date, end_date, callback) {
    var curr_date = new Date(start_date);
    while (end_date > curr_date) {
        callback(curr_date);
        curr_date.inc();
    }
}

function next_month(day) {
    return moment(day).add(1, 'month').toDate();
}

function prev_month(day) {
    return moment(day).subtract(1, 'month').toDate();
}

function next_day(day) {
    return moment(day).add(1, 'day').toDate();
}

function prev_day(day) {
    return moment(day).subtract(1, 'day').toDate();
}

function weekday_en(i) {
    return moment_locale_en._weekdaysMin[i % 7];
}

function weekday_min(i) {
    return moment_locale._weekdaysMin[i % 7];
}

function weekday(i) {
    return moment_locale._weekdays[i % 7];
}

function sunday_first_day_of_a_week() {
    return moment_locale.firstDayOfWeek() === 0;
}

function get_max_free_days(holidays_left, start_date) {

    var total_days = 0;
    var curr_date = new Date(start_date);

    while (curr_date <= user_data.opts.to) {

        if (is_date_taken_holiday(curr_date)) {
            //break;
            return null;
        }

        if (curr_date.is_saturday()) {
            if (curr_date.is_holiday()) {
                if (user_data.opts.holiday_on_sat_extends_holiday) {
                    holidays_left++;
                }
            }
            total_days++;
            curr_date.inc();
            continue;
        }

        if (curr_date.is_sunday()) {
            total_days++;
            curr_date.inc();
            continue;
        }

        if (curr_date.is_holiday()) {
            total_days++;
            curr_date.inc();
            continue;
        }

        if (holidays_left === 0) break;
        total_days++;
        holidays_left--;
        curr_date.inc();
    }

    return {
        start_date: new Date(start_date),
        end_date: prev_day(curr_date),
        total_days: total_days
    };
}

function is_date_taken_holiday(day) {

    if (user_data.opts.do_not_overlap_with_blacklist_days === false) return false;

    for (var i = 0; i < user_data.holidays_taken.length; i++) {
        var holiday = user_data.holidays_taken[i];
        if (day >= holiday.from && day <= holiday.to) {
            return true;
        }
    }
    return false;

}

function get_max_free_days_a_year(holidays_left) {

    var curr_date = new Date(user_data.opts.from);
    var end_date = new Date(user_data.opts.to);
    var possible_dates = [];

    var seeders = $.map($(".d_start_holiday"), function (val) {
        return parse_id(val.id).date;
    });

    if (seeders.length > 0) {

        seeders.forEach(function (curr_date) {
            console.log("starting from seed", curr_date);

            if (is_date_taken_holiday(curr_date)) {
                return;
            }

            if (user_data.opts.start_in_the_mid_week) {
                if (!curr_date.is_a_mid_week()) return;
            }

            var t = get_max_free_days(holidays_left, curr_date);
            if (t == null) return;
            if (possible_dates[t.total_days] === undefined) {
                possible_dates[t.total_days] = [];
            }
            possible_dates[t.total_days].push(t);
        });

    } else {

        var fst_time_end_reached = false;
        while (end_date > curr_date) {

            if (is_date_taken_holiday(curr_date)) {
                curr_date.inc();
                continue;
            }

            if (curr_date.is_sunday() && curr_date.getTime() != end_date.getTime()) {
                //don't count on sun, as on sat it was bigger for sure
                curr_date.inc();
                continue;
            }

            if (user_data.opts.start_in_the_mid_week) {
                while (!curr_date.is_a_mid_week()) {
                    curr_date.inc();
                }
            }

            var t = get_max_free_days(holidays_left, curr_date);
            if (t == null) {
                curr_date.inc();
                continue;
            }

            if (user_data.opts.finish_in_the_mid_week && !t.end_date.is_a_mid_week()) {
                curr_date.inc();
                continue;
            }
            if (t.end_date.getTime() == user_data.opts.to.getTime()) {
                if (fst_time_end_reached) {
                    curr_date.inc();
                    continue;
                }
                fst_time_end_reached = true;
            }

            if (possible_dates[t.total_days] === undefined) {
                possible_dates[t.total_days] = [];
            }
            possible_dates[t.total_days].push(t);

            curr_date.inc();
        }

    }

    possible_dates.sort(function (a, b) {
        return b[0].total_days - a[0].total_days;
    });

    return possible_dates;
}

function get_uid() {
    var uid = window.location.search.substring(1);
    if (uid === "") return "anonymous";
    return uid;
}

function parse_id(id) {
    var y = parseInt(id.substring(2, 6));
    var m = parseInt(id.substring(7, id.indexOf("_", 7))) + 1;
    var d = parseInt(id.substring(id.lastIndexOf("_") + 1));
    return {
        "y": y,
        "m": m,
        "d": d,
        "date": new Date(m + "/" + d + "/" + y)
    }
}

function month_id(day) {
    return "m_" + day.getFullYear() + "_" + day.getMonth() + "_" + day.getDate();
}

function day_id(day) {
    return "d_" + day.getFullYear() + "_" + day.getMonth() + "_" + day.getDate();
}

function day_node(day) {
    return $("#" + day_id(day));
}

var make = {
    node: function (node_name, opt_node) {
        var nd = $("<" + node_name + "></" + node_name + ">");
        if (opt_node !== undefined) {
            nd.append(opt_node);
        }
        return nd;
    },
    p: function (opt_node) {
        return make.node("p", opt_node);
    },
    a: function (opt_node) {
        var a = make.node("a", opt_node);
        a.attr('href', 'javascript:void(0)');
        return a;
    },
    b: function (opt_node) {
        return make.node("b", opt_node);
    },
    tr: function (opt_node) {
        return make.node("tr", opt_node);
    },
    td: function (opt_node) {
        return make.node("td", opt_node);
    },
    th: function (opt_node) {
        return make.node("th", opt_node);
    },
    div: function (opt_node) {
        return make.node("div", opt_node);
    },
    h3: function (opt_node) {
        return make.node("h3", opt_node);
    },
    h4: function (opt_node) {
        return make.node("h4", opt_node);
    },
    legend: function (opt_node) {
        return make.node("legend", opt_node);
    }
}
