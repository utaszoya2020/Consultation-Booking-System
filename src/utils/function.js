
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

// generate starttime
export const generateStartTime = (string) => {
    const newString = string.toString();
    const start = 0;
    const end = 24;
    const newStartTime = newString.slice(start, end);
    return newStartTime;
}

// generate endtime
export const generateEndTime = (string) => {
    const newString = string.toString();
    const start = 16;
    const end = 24;
    const newStartTime = newString.slice(start, end);
    return newStartTime;
}

// identify if disabled
export const generatenewTimeOptions = (obj,inputoptions) => {
    console.log(obj);
    console.log(inputoptions);
    const length = obj.length;
  
    const options = [...inputoptions];
    
    for (let i =0; i<length; i++) {
      const str1 = obj[i].start.toString();
      console.log(str1);
      const result0 = str1.indexOf("09:00");
      const result1 = str1.indexOf("10:00");
      const result2 = str1.indexOf("11:00");
      const result3 = str1.indexOf("12:00");
      const result4 = str1.indexOf("13:00");
      const result5 = str1.indexOf("14:00");
      const result6 = str1.indexOf("15:00");
      const result7 = str1.indexOf("16:00");
      console.log(result2);
      if(result0 != -1) {
        options[0].disabled=true;
      }else if (result1 != -1){
        options[1].disabled=true;
      }else if (result2 != -1){
        options[2].disabled=true;
      }else if (result3 != -1){
        options[3].disabled=true;
      }else if (result4 != -1){
        options[4].disabled=true;
      }else if (result5 != -1){
        options[5].disabled=true;
      }else if (result6 != -1){
        options[6].disabled=true;
      }else if (result7 != -1){
        options[7].disabled=true;
      }
    }
    console.log(options);
return options;

  
    
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