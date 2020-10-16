import moment from 'moment';
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
//sort by time
export function compare(property){
    return function(obj1,obj2){
        var value1 = obj1[property].toString();
        var value2 = obj2[property].toString();
        return value1 - value2;     // 升序
    }
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
export const generatenewTimeOptions = (obj) => {
     console.log(obj);
    // const currentDate = new Date();
    // const formatDate = moment(currentDate).format('YYYY-MM-DD');
    // console.log(formatDate);
    // const clickedDate = moment(obj[0].start).format('YYYY-MM-DD');
    // console.log(clickedDate);
    const length = obj.length;
 
    const options = [
        {label: '09:00 - 09:50', value: '09:00 - 09:50', disabled: false},
        {label: '10:00 - 10:50', value: '10:00 - 10:50', disabled: false},
        {label: '11:00 - 11:50', value: '11:00 - 11:50', disabled: false},
        {label: '12:00 - 12:50', value: '12:00 - 12:50', disabled: false},
        {label: '13:00 - 13:50', value: '13:00 - 13:50', disabled: false},
        {label: '14:00 - 14:50', value: '14:00 - 14:50', disabled: false},
        {label: '15:00 - 15:50', value: '15:00 - 15:50', disabled: false},
        {label: '16:00 - 16:50', value: '16:00 - 16:50', disabled: false},
        ];

  
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