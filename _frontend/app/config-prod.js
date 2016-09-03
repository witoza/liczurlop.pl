function backend_remove_user(uid, callback) {

    console.log("backend_remove_user", uid);

    $.ajax({
        type: "POST",
        url: "/user/remove/" + uid,
        cache: false,
        success: function (json) {
            console.log("removed ok", json);
            if (json.err === 1) {
                alert(json.msg);
                return;
            }
            if (callback !== undefined) {
                callback(json);
            }
        },
        failure: function (err_json) {
            console.log("removed error", err_json);
            alert("There has been a backend problem. Come back later");
        }
    });

    window.location.href = window.location.pathname;
}

function backend_save_user(uid, user_data, callback) {

    console.log("backend_save_user", uid);

    if (uid === "anonymous") {
        $.ajax({
            type: "POST",
            url: "/user/save/new",
            cache: false,
            data: JSON.stringify(user_data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                console.log("save/create ok", json);
                if (json.err === 1) {
                    alert(json.msg);
                    return;
                }
                if (callback !== undefined) {
                    callback(json);
                }
                window.location.href = window.location.pathname + "?" + json.uid;
            },
            failure: function (err_json) {
                console.log("save/create error", err_json);
                alert("There has been a backend problem. Come back later");
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/user/save/" + uid,
            cache: false,
            data: JSON.stringify(user_data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (json) {
                console.log("save ok", json);
                if (json.err === 1) {
                    alert(json.msg);
                    return;
                }
                if (callback !== undefined) {
                    callback(json);
                }
            },
            failure: function (err_json) {
                console.log("save error", err_json);
                alert("There has been a backend problem. Come back later");
            }
        });
    }

}

function backend_get_user(uid, callback) {

    console.log("backend_get_user", uid);

    $.ajax({
        type: "POST",
        url: "/user/" + uid,
        cache: false,
        dataType: "json",
        success: function (json) {
            console.log("get user ok", json);
            if (json.err === 1) {
                alert(json.msg);
                return;
            }
            if (callback !== undefined) {
                callback(json);
            }
        },
        failure: function (err_json) {
            console.log("get user error", err_json);
            alert("There has been a backend problem. Come back later");
        }
    });

}