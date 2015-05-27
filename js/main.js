/*global document, $*/

"use strict";

document.addEventListener("DOMContentLoaded", function () {
    var CURSOR_BLINK = 400,
        TEXT_SPEED = 100,
        PAGE_TRANSITION = 300,
        PAGE_WAIT = 3000,
        text = $('#title-text a'),
        cursor = $('#title-cursor'),
        totalTime = 0,
        BLINK_STEP,
        steps1,
        steps2;

    function blinkCursor() {
        cursor.toggleClass('hidden');
    }

    function writeText(i) {
        text.text(this.text.slice(0, i + 1));
    }

    function clearText() {
        text.text('');
    }

    BLINK_STEP = {
        delay: CURSOR_BLINK,
        times: 4,
        method: blinkCursor
    };

    steps1 = [
        BLINK_STEP,
        {
            delay: TEXT_SPEED,
            text: "Hello World!",
            method: writeText
        },
        {
            delay: CURSOR_BLINK,
            times: 6,
            method: blinkCursor
        },
    ];

    steps2 = [
        BLINK_STEP,
        {
            delay: TEXT_SPEED,
            text: "My Name is...",
            method: writeText,
            reverse: true
        },
        BLINK_STEP,
        {
            delay: CURSOR_BLINK,
            times: 1,
            method: clearText
        },
        {
            delay: TEXT_SPEED,
            text: "I don't know yet, but I told my parents...",
            method: writeText,
        },
        BLINK_STEP,
        {
            delay: TEXT_SPEED,
            text: "I'm a boy!",
            method: writeText,
        },
        BLINK_STEP,
        {
            delay: TEXT_SPEED,
            text: "Go congratulate them!",
            method: function (i) {
                text.removeClass('no-link');
                writeText.call(this, i);
            }
        },
        {
            delay: CURSOR_BLINK,
            times: 400,
            method: blinkCursor
        },
    ];

    function processStep(step) {
        var times = step.times || step.text.length,
            i;

        for (i = 0; i < times; i += 1) {
            totalTime += step.delay;
            setTimeout(step.method.bind(step, i), totalTime);
        }

        if (step.reverse) {
            processStep(BLINK_STEP);
            for (i = times; i > 0; i -= 1) {
                totalTime += step.delay;
                setTimeout(step.method.bind(step, i), totalTime);
            }
        }
    }

    (function queueSteps() {
        steps1.forEach(processStep);

        // Show the baby
        setTimeout(function () {
            $('#title-text').addClass('title-previous');
        }, totalTime);

        totalTime += PAGE_TRANSITION;
        setTimeout(function () {
            $('#title-text').removeClass('title-current');
            $('#title-img').addClass('title-current');
        }, totalTime);

        totalTime += PAGE_TRANSITION;
        setTimeout(function () {
            $('#title-img').removeClass('title-next');
        }, totalTime);

        // Go to the next step
        totalTime += PAGE_WAIT;
        setTimeout(function () {
            $('#title-img').addClass('title-previous');
            $('#title-text').removeClass('title-previous').addClass('title-next');
        }, totalTime);

        totalTime += PAGE_TRANSITION;
        setTimeout(function () {
            $('#title-img').removeClass('title-current');
            $('#title-text').addClass('title-current');
            text.text('');
        }, totalTime);

        totalTime += PAGE_TRANSITION;
        setTimeout(function () {
            $('#title-text').removeClass('title-next');
        }, totalTime);

        steps2.forEach(processStep);
    }());
});