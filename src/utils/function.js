
export const sessionCreator = (SESSION_RANGE) => {
    const startHour = SESSION_RANGE[0];
    const endHour = SESSION_RANGE[1];
    const session = [];
    for (let i = startHour; i < endHour; i++) {
        if(i < 10) {
            const key = `0${i}`;
            session.push({
                key,
                title: `${key}:00 - ${key}:50`,
            });
        } else {
            const key = i.toString();
            session.push({
                key,
                title: `${key}:00 - ${key}:50`,
            });
        }
    }
    return session;
};

export const sessionValuesCreator = (SESSION_RANGE) => {
    const startHour = SESSION_RANGE[0];
    const endHour = SESSION_RANGE[1];
    const sessionValues = [];
    for (let i = startHour; i < endHour; i++) {
        let key = '';
        if(i < 10) {
            key = `0${i}`;
        } else {
            key = i.toString();
        }
        sessionValues.push(key);
    }
    return sessionValues;
}