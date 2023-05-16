export function formatDurationLong(ms: number) {
    const s = ms / 1000;

    const milliseconds = Math.floor(ms % 1000);
    const seconds = Math.floor(s % 60);
    const minutes = Math.floor((s / 60) % 60);
    const hours = Math.floor((s / 60 / 60) % 24);
    const days = Math.floor(s / 60 / 60 / 24);

    let duration_string = '';
    let daysInDuration = false;
    let hoursInDuration = false;
    let minutesInDuration = false;
    let secondsInDuration = false;

    if (days > 0) {
        duration_string += days.toFixed() + (days == 1 ? ' day' : ' days');
        daysInDuration = true;
    }
    if (hours > 0) {
        if (daysInDuration) duration_string += ', ';
        duration_string += hours.toFixed() + (hours == 1 ? ' hour' : ' hours');
        hoursInDuration = true;
    }
    if (!daysInDuration && minutes > 0) {
        if (hoursInDuration) duration_string += ', ';
        duration_string += minutes.toFixed() + (minutes == 1 ? ' minute' : ' minutes');
        minutesInDuration = true;
    }
    if (!daysInDuration && !hoursInDuration && seconds > 0) {
        if (minutesInDuration) duration_string += ', ';
        duration_string += seconds.toFixed() + (seconds == 1 ? ' second' : ' seconds');
        secondsInDuration = true;
    }
    if (!daysInDuration && !hoursInDuration && !minutesInDuration) {
        if (secondsInDuration) duration_string += ', ';
        duration_string +=
            milliseconds.toFixed() + (milliseconds == 1 ? ' millisecond' : ' milliseconds');
    }

    // if (duration_string[0] === '0')
    //     duration_string = duration_string.slice(1)

    return duration_string;
}

export function formatDuration(ms: number) {
    const showMs = false;
    const s = ms / 1000;

    const milliseconds = Math.floor(ms % 1000);
    const seconds = Math.floor(s % 60);
    const minutes = Math.floor((s / 60) % 60);
    const hours = Math.floor((s / 60 / 60) % 24);
    const days = Math.floor(s / 60 / 60 / 24);

    let duration_string = '';
    let daysInDuration = false;
    let hoursInDuration = false;
    let minutesInDuration = false;
    let secondsInDuration = false;

    if (days > 0) {
        duration_string += days.toFixed() + 'd'
        daysInDuration = true;
    }
    if (hours > 0) {
        if (daysInDuration) duration_string += ', ';
        duration_string += hours.toFixed() + 'h'
        hoursInDuration = true;
    }
    if (!daysInDuration && minutes > 0) {
        if (hoursInDuration) duration_string += ', ';
        duration_string += minutes.toFixed() + 'm'
        minutesInDuration = true;
    }
    if (!daysInDuration && !hoursInDuration && seconds > 0) {
        if (minutesInDuration) duration_string += ', ';
        duration_string += seconds.toFixed() + 's'
        secondsInDuration = true;
    }
    if (showMs && !daysInDuration && !hoursInDuration && !minutesInDuration) {
        if (secondsInDuration) duration_string += ', ';
        duration_string +=
            milliseconds.toFixed() + (milliseconds == 1 ? ' millisecond' : ' milliseconds');
    }

    // if (duration_string[0] === '0')
    //     duration_string = duration_string.slice(1)

    return duration_string;
}

export function formatBytes(bytes: number): string {
    let bytesString = ''
    if (bytes < 1000) {
        bytesString = `${Math.round(bytes)} B`
    }
    else if (bytes < 1000 * 1000) {
        bytesString = `${Math.round(bytes / 1000)} kB`
    }
    else if (bytes < 1000 * 1000 * 1000) {
        bytesString = `${Math.round(bytes / 1000 / 1000)} MB`
    }
    else if (bytes < 1000 * 1000 * 1000 * 1000) {
        bytesString = `${Math.round(bytes / 1000 / 1000 / 1000)} GB`
    }
    return bytesString
}
