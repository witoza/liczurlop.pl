function interate_h(holiday, func) {
    return iterate(holiday.from, next_day(holiday.to), func);
}

function make_callendar() {

    function offset(day) {
        if (sunday_first_day_of_a_week()) {
            return day.getDay();
        } else {
            if (day.is_sunday()) return 6;
            return day.getDay() - 1;
        }
    }

    function MAGIC(i) {
        i = i % 7;
        if (sunday_first_day_of_a_week()) {
            return i;
        } else {
            if (i == 6) return 0;
            return i + 1;
        }
    }

    var curr_date = new Date(user_data.callendar_begin);

    var data = [];

    while (user_data.callendar_end > curr_date) {
        var month = curr_date.getMonth() + curr_date.getFullYear() * 12;

        if (data[month] === undefined) {
            data[month] = {
                first_date: new Date(curr_date),
                offset: offset(curr_date),
                dates: []
            }
        }

        data[month].dates.push(new Date(curr_date));
        curr_date.inc();
    }

    var max_days_in_months = 0;
    data.forEach(function (data_month) {
        var t = data_month.offset + data_month.dates.length;
        if (t > max_days_in_months) {
            max_days_in_months = t;
        }
    });

    var plus_icon_html = '<span class="clickable">&nbsp;&nbsp;<i class="fa fa-plus"></i>&nbsp;&nbsp;</span>';
    var minus_icon_html = '<span class="clickable">&nbsp;&nbsp;<i class="fa fa-minus"></i>&nbsp;&nbsp;</span>';

    function refresh_data_after_adjust_callendar() {
        update_dp($("#datepicker_d1"), user_data.opts.from, user_data.opts.to);
        makehtml_callendar();
        refresh_holidays_on_callendar();
        refresh_calendar_begin_end();
        refresh_right_panel();
    }

    var a3 = $(plus_icon_html).click(function () {
        user_data.callendar_begin = prev_month(user_data.callendar_begin);
        user_data.opts.from = prev_month(user_data.opts.from);

        refresh_data_after_adjust_callendar();
    });

    var a4 = $(minus_icon_html).click(function () {
        user_data.callendar_begin = next_month(user_data.callendar_begin);
        user_data.opts.from = next_month(user_data.opts.from);

        refresh_data_after_adjust_callendar();
    });

    var d = make.div().append(a3).append(a4);
    d.attr("align", "right");

    var tr = make.tr();
    tr.append(make.th(d));
    for (var i = 0; i < max_days_in_months; ++i) {
        var caption = weekday_min(MAGIC(i));
        tr.append(make.th(caption));
    }

    var T = make.node("table");
    var thead = make.node("thead", tr);
    T.append(thead);
    data.forEach(function (data_month) {

        var day = data_month.first_date;

        var caption = day.month_str();
        if (day.getFullYear() != 2015) {
            caption = caption + "'" + day.getFullYear().toString().substring(2, 4);
        }
        var monthNbr = data_month.first_date.getMonth();

        var td = make.td(caption)
            .addClass("clickable")
            .addClass("w_month")
            .attr("month", monthNbr)
            .attr("id", month_id(day));

        var tr = make.tr(td);

        for (var i = 0; i < data_month.offset; ++i) {
            tr.append(make.td()
                .addClass("d_empty")
                .addClass("d_day_" + weekday_en(MAGIC(i))));
        }

        data_month.dates.forEach(function (day) {
            var p = make.div(day.getDate());
            p.attr("style", "width : 16px;");

            var td = make.td(p)
                .addClass("d_day_" + weekday_en(day.getDay()))
                .attr('id', day_id(day));

            if (day.is_holiday()) {
                td.addClass("fiesta")

                p.addClass("with_tooltip");
                p.attr("title", day.get_holiday().name);

            }

            tr.append(td);
        });

        var delta = data_month.dates.length + data_month.offset;

        for (i = delta; i < max_days_in_months; ++i) {
            tr.append(make.td()
                .addClass("d_empty")
                .addClass("d_day_" + weekday_en(MAGIC(i)))
            );
        }

        T.append(tr);

    });

    var a1 = $(plus_icon_html).click(function () {
        user_data.callendar_end = next_month(user_data.callendar_end);
        user_data.opts.to = next_month(user_data.opts.to);

        refresh_data_after_adjust_callendar();
    });

    var a2 = $(minus_icon_html).click(function () {
        user_data.callendar_end = prev_month(user_data.callendar_end);
        user_data.opts.to = prev_month(user_data.opts.to);

        refresh_data_after_adjust_callendar();
    });

    var d2 = make.div().append(a1).append(a2);
    d2.attr("align", "right");

    var tfoot = make.node("tfoot", make.tr(make.td(d2)));

    T.append(tfoot);

    return make.div().append("<legend>" + translate("Calendar") + "</legend>").append(T);
}

function is_selected_drange_from_user_clicks() {
    if (user_data.selected_drange != null &&
        user_data.selected_drange.orgin == "seeder") {
        return true;
    }
    return false;
}

function add_listeners_to_click(nd) {

    nd.find("[id^=m_]").click(function () {
        var node = $(this);
        var id = node.attr("id");
        var p = parse_id(id);
        iterate(p.date, next_month(p.date), function (day) {
            day_node(day).toggleClass("d_start_holiday");
        });

        $("#close_summary").show();
    });

    nd.find("[id^=d_]").click(function () {
        var node = $(this);
        node.toggleClass("d_start_holiday");

        var seeders = $(".d_start_holiday");
        if (seeders.size() == 2) {
            var start_date = parse_id(seeders[0].id).date;
            var end_date = parse_id(seeders[1].id).date;

            user_data.selected_drange = {
                "start_date": start_date,
                "end_date": end_date,
                "orgin": "seeder"
            }
            draw_summary(user_data.selected_drange);

        } else {
            if (is_selected_drange_from_user_clicks()) {

                user_data.selected_drange = null;
                refresh_summary();
            }
        }

        $("#close_summary").show();
    });

}

function makehtml_callendar() {
    var c = make_callendar();
    add_listeners_to_click(c);
    $("#calendar_id").html(c);
    $(".with_tooltip").tooltip();
}

function process_by_template(name, data) {
    var func = null;
    if (name.indexOf("#") === 0) {
        var ts = $(name + "_" + moment_locale._abbr);
        if (ts.length === 0) {
            ts = $(name);
        }
        func = Handlebars.compile(ts.html());
    } else {
        func = Handlebars.compile(name);
    }
    return func(data);
}

function make_summary(obj) {

    function date_to_str_long(day) {
        return day.getDate() + " " + day.month_str() + " (" + weekday(day.getDay()) + ")" + format_year(day);
    }

    function count_holidays_on_saturday(obj) {
        var t = 0;
        iterate(obj.start_date, next_day(obj.end_date), function (day) {
            if (day.is_holiday() && day.is_saturday()) {
                t++;
            }
        });
        return t;
    }

    function diff_days(d1, d2) {
        return moment.duration(moment(d1).diff(moment(d2))).asDays();
    }

    var diff = Math.round(diff_days(obj.start_date, moment()));
    var diff2 = Math.round(diff_days(obj.end_date, obj.start_date)) + 1;

    var v3 = null;
    if (diff > 0) {
        v3 = translate("It is in ") + diff + " " + day_as_str(diff);
    } else if (diff === 0) {
        v3 = translate("It is tommorow!");
    } else {
        v3 = translate("Starts in the past");
    }

    var v6 = count_holidays_on_saturday(obj);
    var data = {
        v1: date_to_str_long(obj.start_date),
        v2: date_to_str_long(obj.end_date),
        v3: v3,
        v4: count_number_of_taken_leave_days(obj.start_date, obj.end_date),
        v5: diff2,
        v6: v6,
        holiday_on_sat_extends_holiday: user_data.opts.holiday_on_sat_extends_holiday && v6 > 0
    };

    if (v6 > 0 && !is_selected_drange_from_user_clicks()) {
        data["v6_details"] = true;
    }

    var nd = make.div(process_by_template("#summary_template", data));

    var a2 = make.a(make.b(translate("new Leave Days")))
        .click(function (event) {
            add_holiday(event, {
                type: "holiday",
                from: obj.start_date,
                to: obj.end_date,
                comment: "",
                unpaid: false,
                on_demand: false,

                show: true
            });
        });

    var a3 = make.a(make.b(translate("new Blacklist Days")))
        .click(function (event) {
            add_holiday(event, {
                type: "blacklist",
                from: obj.start_date,
                to: obj.end_date,
                comment: "",
                show: true
            });
        });


    var li = $("<ul class='fa-ul'>");

    var icon = '<i class="fa-li fa fa-angle-double-right"></i>';
    li.append(make.node("li", icon).append(translate("Add as a ")).append(a2));
    li.append(make.node("li", icon).append(translate("Add as a ")).append(a3));

    nd.append(li);

    nd.find("#close_summary").click(function () {
        console.log("closing summary");
        user_data.selected_drange = null;
        draw_summary(user_data.selected_drange);
    });

    return nd;
}

function draw_summary(date_range) {
    $("[id^=d_]").removeClass("d_selected");
    $("#summary_id").empty();
    if (date_range != null) {
        iterate(date_range.start_date, next_day(date_range.end_date), function (day) {
            day_node(day).addClass("d_selected");
        });
        $("#summary_id").append(make_summary(date_range));
    }
}

function make_results() {

    function format_date_range(d1, d2) {
        function date_to_str(day) {
            return day.getDate() + " " + day.month_str().substring(0, 3) + format_year(day);
        }

        var res = null
        if (d1.getMonth() === d2.getMonth()) {
            res = d1.getDate() + " - " + d2.getDate() + " " + d1.month_str().substring(0, 3) + format_year(d1);
        } else {
            res = date_to_str(d1) + " - " + date_to_str(d2);
        }
        return res.toLowerCase();
    }

    var possible_dates = get_max_free_days_a_year(user_data.selected_leave_days);

    var pills = $('<ul class="nav nav-pills">');
    var content = $('<div class="tab-content">');

    var tid = 0;
    possible_dates.forEach(function (possible_date) {
        tid += 1;
        var total_days = possible_date[0].total_days;

        var item = $('<li><a style="padding: 5px 10px;" href="#pane' + tid + '" data-toggle="tab">' + total_days + ' ' + day_as_str(total_days) + '</a></li>');
        if (tid == 1) item.addClass("active");
        pills.append(item);

        var c = $('<div id="pane' + tid + '" class="tab-pane"><br/></div>');
        if (tid == 1) c.addClass("active");
        c.append(make.b(translate("Possible dates") + ": "));
        possible_date.forEach(function (obj) {
            var p = make
                .a(format_date_range(obj.start_date, obj.end_date))
                .hover(
                    function () {
                        draw_summary(obj);
                    },
                    function () {
                        draw_summary(user_data.selected_drange);
                    }
                )
                .click(function () {
                    user_data.selected_drange = obj;
                });

            c.append(p).append(", ");

        });
        content.append(c);
    });
    if (tid === 1) {
        user_data.selected_drange = possible_dates[0][0];
        draw_summary(user_data.selected_drange);
    }

    if (tid === 0) {
        content.append(make.div().append(make.b("No possible holiday found :(")).append("<br/>The typical cause of this is that leave days are to big and it always intersects with Blacklist days. <br/>Change search options and try again please."));
    }

    var n = $('<div class="tabbable">')
        .append(pills)
        .append(content);

    return make.div().append("<p></p>").append(n);
}

function day_as_str(days) {
    if (days === 1) return translate("day");
    return translate("days");
}

function format_date_range(d1, d2) {

    function date_to_str_long2(day) {
        var res = day.getDate() + " " + day.month_str() + " (" + weekday_min(day.getDay()) + ")";
        return res + format_year(day);
    }

    if (fmtMMDDYYYY(d1) == fmtMMDDYYYY(d2)) {
        return date_to_str_long2(d1);
    }

    if (d1.getMonth() === d2.getMonth()) {
        return (
            d1.getDate() + " (" + weekday_min(d1.getDay()) + ") " + " - " +
            d2.getDate() + " (" + weekday_min(d2.getDay()) + ") " + d1.month_str() + format_year(d1)
        ).trim();
    } else {
        return date_to_str_long2(d1) + " - " + date_to_str_long2(d2);
    }
}

function create_callendar_icon(holiday, ind) {
    var icon = $('<i class="fa-li clickable fa fa-thumb-tack"></i>')
        .click(function () {
            holiday.show = !holiday.show;
            if (holiday.show) {
                icon.attr("style", "color: #4183c4;");
            } else {
                icon.attr("style", "");
            }
            refresh_holidays_on_callendar();
        });
    if (holiday.show) {
        icon.attr("style", "color: #4183c4;");
    }
    return icon;
}

function refresh_holidays_on_callendar() {
    console.log("refresh_holidays_on_callendar");

    $(".d_holiday_teken_selected_calendar")
        .unbind('mouseenter mouseleave')
        .removeClass("d_holiday_teken_selected_calendar")
        .find("div").tooltip('destroy')
    ;

    $(".d_blacklist_selected_calendar")
        .unbind('mouseenter mouseleave')
        .removeClass("d_blacklist_selected_calendar")
        .find("div").tooltip('destroy')
    ;


    function h_out(holiday, id) {
        $("[id^=holiday_]").removeClass("d_hover_menu");
        $("[id^=d_]").removeClass("d_hover_calendar");
    }

    function h_in(holiday, id) {
        h_out(holiday, id);

        $("#holiday_" + id).addClass("d_hover_menu");
        interate_h(holiday, function (day) {
            var nd = day_node(day);
            nd.addClass("d_hover_calendar");
        });
    }

    var ind = -1;
    user_data.holidays_taken.forEach(function (holiday) {
        ind++;

        if (holiday.show) {
            interate_h(holiday, function (day) {

                var node = day_node(day);
                var title = holiday.comment;// + ": "+format_date_range(holiday.from, holiday.to);
                node.find("div").attr("title", title).tooltip();

                function f1() {
                    h_in(holiday, index);
                }

                function f2() {
                    h_out(holiday, index);
                }

                var index = ind;
                if (holiday.type == "holiday") {
                    node.addClass("d_holiday_teken_selected_calendar");
                    node.hover(f1, f2);
                } else {
                    if (user_data.show_blacklist_days) {
                        node.addClass("d_blacklist_selected_calendar");
                        node.hover(f1, f2);
                    }
                }
            });
        }
    });

}

function make_blacklist_days() {
    var ul = make.node("ul")
        .addClass("fa-ul");

    var ind = -1;
    user_data.holidays_taken.forEach(function (holiday) {
        ind++;
        if (holiday.type != "blacklist") return;

        var str = "<p style='padding: 2px 2px; margin:0 0 0px'>";
        if (!is_empty(holiday.comment)) {
            str = str + "<b>" + holiday.comment + "</b>" + ", ";
        }
        str = str + format_date_range(holiday.from, holiday.to) + "</p>";

        var index = ind;

        function hover_holiday() {
            li.toggleClass("d_hover_menu");
            interate_h(holiday, function (day) {
                day_node(day).toggleClass("d_hover_calendar");
            });
        }

        var the_pill = $(str)
            .click(function (event) {
                edit_holiday(event, holiday, index);
            })
            .hover(hover_holiday, hover_holiday);

        var li = make.node("li")
            .append(create_callendar_icon(holiday, index))
            .append(the_pill)
            .attr("id", "holiday_" + index);

        ul.append(li);

    });

    var add_holiday_btn = $('<i class="fa-li clickable fa fa-plus"></i>').click(function (event) {
        add_holiday(event, {
            type: "blacklist",
            from: "",
            to: "",
            comment: "",
            show: true
        });
    });

    ul.append(make.node("li", add_holiday_btn));

    var btn_close = $('<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>')
        .click(function () {
            user_data.show_blacklist_days = false;
            $("#blacklist_days_id").empty();
            refresh_holidays_on_callendar();
        });

    var legend = make.legend(translate("Blacklist days")).append(btn_close);

    return make.div()
        .append(legend)
        .append(ul)
        .append("<br/>");
}

function count_number_of_taken_leave_days(from, to) {
    var taken_days = 0;
    iterate(from, next_day(to), function (day) {
        if (day.is_holiday() && day.is_saturday()) {
            if (user_data.opts.holiday_on_sat_extends_holiday) {
                taken_days--;
            }
        } else {
            var fiesta = day.is_holiday() || day.is_saturday() || day.is_sunday();
            if (!fiesta) {
                taken_days++;
            }
        }
    });
    return taken_days;
}

function make_holidays_taken() {

    var ul = make.node("ul")
        .addClass("fa-ul");

    var taken_days_total = 0;
    var ind = -1;
    user_data.holidays_taken.forEach(function (holiday) {
        ind++;
        if (holiday.type != "holiday") return;

        var taken_days = count_number_of_taken_leave_days(holiday.from, holiday.to);
        if (holiday.unpaid === false) {
            taken_days_total = taken_days_total + taken_days;
        }

        var str = "<p style='padding: 2px 2px; margin:0 0 0px'>";
        if (!is_empty(holiday.comment)) {
            str = str + "<b>" + holiday.comment + "</b>" + ", ";
        }
        str = str + taken_days + " " + day_as_str(taken_days) + ": " + format_date_range(holiday.from, holiday.to) + "</p>";

        var index = ind;

        function hover_holiday() {
            li.toggleClass("d_hover_menu");
            interate_h(holiday, function (day) {
                day_node(day).toggleClass("d_hover_calendar");
            });
        }

        var the_pill = $(str)
            .click(function (event) {
                edit_holiday(event, holiday, index);
            })
            .hover(hover_holiday, hover_holiday);

        var li = make.node("li")
            .append(create_callendar_icon(holiday, index))
            .append(the_pill)
            .attr("id", "holiday_" + index);

        ul.append(li);
    });

    var add_holiday_btn = $('<i class="fa-li clickable fa fa-plus"></i>').click(function (event) {
        add_holiday(event, {
            type: "holiday",
            from: "",
            to: "",
            comment: "",
            unpaid: false,
            on_demand: false,
            show: true
        });
    });

    ul.append(make.node("li", add_holiday_btn));

    var total = "";
    if (ind > -1) {
        total = make.p(translate("Total days taken") + ": ");
        var aa = make.a("<b>" + taken_days_total + "</b> / " + user_data.opts.leave_days)
            .click(function () {
                display_user_seetings();
            });
        total.append(aa);
    } else {
        total = "<br/>";
    }
    return make.div()
        .append(make.legend(translate("Leave days")))
        .append(ul)
        .append("<br/>")
        .append(total);
}

function refresh_search_results(should_draw_results) {
    console.log("refresh_search_results");

    $("#results_id").empty();
    if (should_draw_results) {
        $("#results_id").html(make_results());
    } else {
        if (user_data.selected_drange == null) {
            $("#close_summary").hide();
        }
    }
}

function refresh_calendar_begin_end() {
    console.log("refresh_calendar_begin_end");

    $("[id^=d_]").removeClass("d_disabled");

    iterate(user_data.callendar_begin, user_data.opts.from, function (day) {
        day_node(day).addClass("d_disabled");
    });
    iterate(next_day(user_data.opts.to), user_data.callendar_end, function (day) {
        day_node(day).addClass("d_disabled");
    });
}

function refresh_summary() {
    console.log("refresh_summary");
    draw_summary(user_data.selected_drange);
}

function refresh_right_panel() {
    console.log("refresh_right_panel");

    $("#holidays_taken_id").html(make_holidays_taken());

    if (user_data.show_blacklist_days) {
        $("#blacklist_days_id").html(make_blacklist_days());
    }

    if (!is_empty(user_data.meta.username)) {
        $("#username").text(user_data.meta.username);
    } else {
        $("#username").text(get_uid());
    }

}

function format_year(day) {
    if (day.getFullYear() != 2015) {
        return " " + day.getFullYear();
    }
    return "";
}

function makehtml_options() {
    $("#options_id").html(process_by_template("#options_template"));
}

function save_user_action() {
    backend_save_user(get_uid(), user_data);
}

function create_options_gui() {

    var cls_btn = $("#close_summary");
    var more_options = $("#more_options");

    cls_btn.hide().click(function () {
        $("[id^=d_]").removeClass("d_start_holiday");
        user_data.selected_drange = null;
        more_options.hide();

        refresh_summary();
        refresh_search_results(false);
        cls_btn.hide();
    });

    $("#do_search").click(function () {
        cls_btn.show();
        refresh_search_results(true);
    });
    $("#do_show_more_options").click(function () {
        more_options.toggle(200);
    });
    more_options.hide();

    $("#show_blacklist_days").click(function () {
        if (user_data.show_blacklist_days === true) {
            $("#blacklist_days_id").empty();
        }
        user_data.show_blacklist_days = !user_data.show_blacklist_days;
        refresh_right_panel();
        refresh_holidays_on_callendar();
    });

    var dp1 = $('#datepicker_d1');
    dp1.find("#h_from").val(fmtMMDDYYYY(user_data.opts.from));
    dp1.find("#h_to").val(fmtMMDDYYYY(user_data.opts.to));
    dp1.datepicker({
        autoclose: true
    });

    //update_dp(dp1, user_data.opts.from, user_data.opts.to);
    dp1.on('changeDate', function (ev) {

        function as_date(val) {
            if (is_empty(val)) return null;
            return new Date(val);
        }

        var should = false;

        var vf = as_date(dp1.find("#h_from").val());
        if (user_data.opts.from.getTime() != vf.getTime()) {
            should = true;
            user_data.opts.from = vf;
        }

        var vt = as_date(dp1.find("#h_to").val());
        if (user_data.opts.to.getTime() != vt.getTime()) {
            should = true;
            user_data.opts.to = vt;
        }

        if (should) refresh_calendar_begin_end();
    });

    $("#opt_start_in_the_mid_week").prop('checked', user_data.opts.start_in_the_mid_week);
    $("#opt_finish_in_the_mid_week").prop('checked', user_data.opts.finish_in_the_mid_week);
    $("#opt_do_not_overlap_with_blacklist_days").prop('checked', user_data.opts.do_not_overlap_with_blacklist_days);

    $("#opt_start_in_the_mid_week").change(function () {
        user_data.opts.start_in_the_mid_week = $(this).is(':checked');
    });
    $("#opt_finish_in_the_mid_week").change(function () {
        user_data.opts.finish_in_the_mid_week = $(this).is(':checked');
    });
    $("#opt_do_not_overlap_with_blacklist_days").change(function () {
        user_data.opts.do_not_overlap_with_blacklist_days = $(this).is(':checked');
    });

    $("#leave_days_id")
        .val(user_data.selected_leave_days)
        .change(function () {
            user_data.selected_leave_days = parseInt($(this).val());
            refresh_search_results(false);
        });
    $(".with_tooltip").tooltip();
}

function createAndShowGUI() {

    makehtml_callendar();
    makehtml_options();

    create_options_gui();

    $("#datepicker_d2").datepicker({
        autoclose: true
    });

    refresh_holidays_on_callendar();
    refresh_calendar_begin_end();
    refresh_right_panel();
}

function update_dp(dp, h_from, h_to) {
    dp.find("#h_from").datepicker('update', h_from);
    dp.find("#h_to").datepicker('update', h_to);
    dp.datepicker('updateDates');
}

function update_edit_taken_holiday_dialog(holiday) {

    var nd = $("#edit_taken_holiday");
    nd.find("#comment").val(holiday.comment);

    if (holiday.type === "holiday") {
        nd.find("#options_for_holiday").show();
        nd.find("#option_on_demand").prop('checked', (holiday.on_demand === true));
        nd.find("#option_unpaid_leave").prop('checked', (holiday.unpaid === true));
    } else {
        nd.find("#options_for_holiday").hide();
    }

    var dp = nd.find("#datepicker_d2");
    update_dp(dp, holiday.from, holiday.to);

    nd.find("#b_remove").off('click').hide();
    nd.find("#b_update").off('click').hide();
    nd.find("#b_add").off('click').hide();

    nd.off('shown.bs.modal').on('shown.bs.modal', function () {
        nd.find("#comment").focus();
    });
}

function poplate_holiday_from_dialog(holiday) {

    var nd = $("#edit_taken_holiday");

    var dp = nd.find("#datepicker_d2");
    var holiday_from = dp.find("#h_from").val();
    var holiday_to = dp.find("#h_to").val();

    if (holiday_from === "") holiday_from = holiday_to;
    if (holiday_to === "") holiday_to = holiday_from;

    if (holiday_from === "" && holiday_to === "") {
        return false;
    }
    holiday.from = new Date(holiday_from);
    holiday.to = new Date(holiday_to);

    holiday.comment = nd.find("#comment").val();

    if (holiday.type === "holiday") {
        holiday.on_demand = nd.find("#option_on_demand").prop('checked');
        holiday.unpaid = nd.find("#option_unpaid_leave").prop('checked');
    }

    console.log("holiday updated", holiday);

    return true;
}

function save_and_close(dialog) {
    save_user_action();
    refresh_right_panel();
    refresh_holidays_on_callendar();
    dialog.modal('hide');
}

function add_holiday(event, holiday) {
    console.log("add new holiday", holiday);

    var nd = $("#edit_taken_holiday");

    if (holiday.type == "holiday") {
        nd.find("#caption").text(translate("Add new Leave days"));
    } else {
        user_data.show_blacklist_days = true;
        refresh_holidays_on_callendar();
        refresh_right_panel();
        nd.find("#caption").text(translate("Add new Blacklist days"));
    }

    update_edit_taken_holiday_dialog(holiday);

    nd.find("#b_add").show().click(function () {

        var is_valid = poplate_holiday_from_dialog(holiday);
        if (is_valid === false) {
            return;
        }

        user_data.holidays_taken.push(holiday);
        user_data.holidays_taken.sort(function (a, b) {
            return a.from > b.from;
        });

        if (is_selected_drange_from_user_clicks()) {
            $("[id^=d_]").removeClass("d_start_holiday");
        }
        save_and_close(nd);

    });

    nd.modal({
        backdrop: "static"
    });
}

function edit_holiday(event, holiday, index) {
    console.log("edit_holiday", index, holiday);

    var nd = $("#edit_taken_holiday");

    if (holiday.type == "holiday") {
        nd.find("#caption").text(translate("Edit Leave days"));
    } else {
        nd.find("#caption").text(translate("Edit Blacklist days"));
    }

    update_edit_taken_holiday_dialog(holiday);

    nd.find("#b_remove").show().click(function () {
        user_data.holidays_taken.splice(index, 1);
        save_and_close(nd);
    });
    nd.find("#b_update").show().click(function () {

        var is_valid = poplate_holiday_from_dialog(holiday);
        if (is_valid === false) {
            return;
        }

        user_data.holidays_taken.sort(function (a, b) {
            return a.from > b.from;
        });

        save_and_close(nd);
    });
    nd.modal({
        backdrop: "static"
    });
}

function are_you_sure_dialog(callback_yes, callback_no) {
    var nd = $("#yes_no_dialog");
    nd.find("#b_yes").off('click').click(function () {
        nd.modal('hide');
        callback_yes();
    });
    nd.find("#b_no").off('click').click(function () {
        nd.modal('hide');
        if (callback_no != null) callback_no();
    });
    nd.modal({
        backdrop: "static"
    });
}

function set_locale(locale) {
    if (is_empty(locale)) return;

    console.log(window.location);

    var should_change_locale =
        (moment_locale._abbr !== locale) || (moment_locale._abbr === "pl" && window.location.pathname === "/");

    if (should_change_locale) {
        console.log("setting new locale", locale);
        moment_locale = moment.localeData(locale);

        var new_url = "/";
        if (locale === "pl") {
            new_url = new_url + locale + "/";
        }
        new_url = new_url + window.location.search;

        var old_url = window.location.pathname + window.location.search;
        if (old_url != new_url) {
            console.log("redirecting to locale awere url", new_url);
            if (is_real_backend()) {
                window.location.href = new_url;
            }
        }

    }
}

function display_user_seetings() {
    console.log("display_user_seetings");
    var nd = $("#edit_user_details");

    nd.find("#human_name_id").val(user_data.meta.username);
    nd.find("#leave_days_for_this_year").val(user_data.opts.leave_days);

    nd.find("#holiday_on_sat_extends_holiday").prop('checked',
        (user_data.opts.holiday_on_sat_extends_holiday === true));

    nd.find("#b_update").off('click').click(function () {
        console.log("updating user details");

        user_data.meta.username = nd.find("#human_name_id").val();
        user_data.meta.locale = moment_locale._abbr;
        user_data.opts.leave_days = nd.find("#leave_days_for_this_year").val();
        user_data.opts.holiday_on_sat_extends_holiday = nd.find("#holiday_on_sat_extends_holiday").is(':checked');

        makehtml_callendar();
        refresh_calendar_begin_end();

        save_and_close(nd);
    });

    nd.find("#remove_account").off('click').click(function () {
        console.log("removing user");

        are_you_sure_dialog(function () {
            backend_remove_user(get_uid(), function () {
                window.location.href = window.location.pathname;
            });
        }, null);

    });
    nd.off('shown.bs.modal').on('shown.bs.modal', function () {
        nd.find("#human_name_id").focus();
    });
    nd.modal({
        backdrop: "static"
    });
}

function fix_user_data() {
    //fix Date objects
    user_data.callendar_begin = new Date(user_data.callendar_begin);
    user_data.callendar_end = new Date(user_data.callendar_end);

    user_data.opts.from = new Date(next_day(new Date()).fmtMMDDYYYY()); //clear time component !
    user_data.opts.to = new Date(user_data.opts.to);

    user_data.holidays_taken.forEach(function (holiday) {
        holiday.from = new Date(holiday.from);
        holiday.to = new Date(holiday.to);
    });

    user_data.selected_drange = null;
}

$(document).ready(function () {

    $(document).on({
        ajaxStart: function () {
            $('html').css('cursor', 'progress');
        },
        ajaxStop: function () {
            $('html').css('cursor', 'default');
        }
    });

    $("#go_to_github").click(function () {
        window.open("https://github.com/witoza", '_blank');
    });

    $("#login_name").keypress(function (e) {
        if (e.which == 13) {
            window.location.href = window.location.pathname + "?" + $("#login_name").val();
        }
    });
    $("#log_me_in").click(function () {
        window.location.href = window.location.pathname + "?" + $("#login_name").val();
    });

    $("#sign_out").click(function () {
        window.location.href = window.location.pathname;
    });
    $("#user_seetings_id").click(display_user_seetings);

    var uid = get_uid();
    backend_get_user(uid, function (json) {
        console.log("response from backend", json);
        user_data = json;
        fix_user_data();
        set_locale(user_data.meta.locale);

        if (uid === "anonymous") {
            $("#div_show_logged_user").hide();
            $("#div_show_login").show();
        } else {
            $("#div_show_logged_user").show();
            $("#div_show_login").hide();
        }

        createAndShowGUI();
        $("#ajax_loader").hide();

    });

});