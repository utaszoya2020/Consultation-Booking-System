
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
// generate currentsessiontime
export const transformArray = (array) => {
    const start = 0;
    const end = 2;
    const length = array.length;
    const currentsession = [];
    for (let i = 0; i < length; i++) {
        const x = array[i].slice(start, end);
        currentsession.push(x);
        
    }
    
    return currentsession;
}

// adjust array from small to big
export const  bubbleSort = (arr) => {

    for(var i = 0; i < arr.length; i++) {
    
    for(var j = 0; j < arr.length; j++) {
    
    if(arr[i] < arr[j]) {
    
    var temp = arr[j];
    
    arr[j] = arr[i];
    
    arr[i] = temp;
    
    }
    
    }
    
    }
    
    return arr;
    
    }
    // change current SessionTime to time array
export const currentSessionCreator = (currentSessionTime) => {
    const length = currentSessionTime.length;
    const session = [];
    for (let i = 0; i < length; i++) {
        
            const key = currentSessionTime[i].toString();
            session.push(
                `${key}:00 - ${key}:50`,
            );
        }
    
    return session;
}

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