  $(document).ready(() => {
    $("#submit").on('click', (e) => {
        e.preventDefault();
        let username = $("#username").val();
        let password = $("#password").val();
        $.ajax({
            url: "/register",
            method: "POST",
            data: {
                username: username,
                password: password
            }
        })
        .done((data) => {
            if(data.reply)
            {
                $("#reply").html(data.reply);
            }
            else if(data.success)
            {
                window.location = "/login";
            }
        })
        .fail((xhr) => {
            console.log("Error occurred");
        });
    });
});