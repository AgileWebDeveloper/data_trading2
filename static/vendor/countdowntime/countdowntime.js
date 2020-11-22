(function($) {
    

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date());
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            total: t,
            days,
            hours,
            minutes,
            seconds,
        };
    }

    function initializeClock(id, endtime) {
        const daysSpan = $('.days');
        const hoursSpan = $('.hours');
        const minutesSpan = $('.minutes');
        const secondsSpan = $('.seconds');

        function updateClock() {
            const t = getTimeRemaining(endtime);

            daysSpan.html(t.days);
            hoursSpan.html((`0${  t.hours}`).slice(-2));
            minutesSpan.html((`0${  t.minutes}`).slice(-2));
            secondsSpan.html((`0${  t.seconds}`).slice(-2));

            if (t.total <= 0) {
                clearInterval(timeinterval);
            }
        }

        updateClock();
        var timeinterval = setInterval(updateClock, 1000);
    }

    const deadline = new Date(Date.parse(new Date()) + 25 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000);
    initializeClock('clockdiv', deadline);
})(jQuery);
