//时间 日期计算
import React, {Component, PropTypes} from 'react';


let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
let Lmonths = [1, 3, 5, 7, 8, 10, 12];    //31天月份
let Rmonths = [4, 6, 9, 11];           //30天月份
let reWeekday = [1, 0, 6, 5, 4, 3, 2];
// let lessWeekday = [6, 0, 1, 2, 3, 4, 5];
let allMonthsDays = [31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];     //非闰年
let leAllMonthsDays = [31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];   //闰年
let eachMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];        //非闰年
let leEachMonthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];      //闰年

export default class TimeNDayCompute extends Component {


    //判断是否是闰年
    static isLeapYear(year) {
        if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
            return true;
        } else {
            return false;
        }
    }


    //将月份转化为天数
    static MonthTransformationDay(year, month) {
        let day = 0;
        if (month <= 12) {
            const subScript = months.indexOf(month);     //获取出下标
            // console.log('subScript'+subScript+'------'+'month'+month);
            for (let i = 0; i < subScript; i++) {    //通过下标读取数值  这里小于 读取到当前月的前-月
                if (i == 1) {     //二月份
                    if (this.isLeapYear(year)) {      //判断是否是闰年
                        day += 29;
                    } else {
                        day += 28;
                    }
                } else {
                    if (Lmonths.indexOf(months[i]) != -1) {    //说明在Lmonths中存在
                        day += 31;
                    } else if (Rmonths.indexOf(months[i]) != -1) {   //说明在Rmonths中存在
                        day += 30;
                    }
                }

            }
        }
        return day;
    }

    //获取出某个日期是一年中的哪一天
    static getWhichDay(year, month, day) {
        // console.log('===monthDay'+this.MonthTransformationDay(year, month)+'day'+day);
        return this.MonthTransformationDay(year, month) + day;
    }


    //获取出某一天是哪一周
    static getCurrentWeek(year, month, day) {
        // console.log(year + '-' + month + '-' + day);
        let week = 0;
        const weekday = new Date(year + '-1-1').getDay();  //首先获取出一月份的第一天是星期几     0表示星期天 [1,2,3,4,5,6,0]
        const allDay = this.getWhichDay(year, month, day);   //获取出日期天数
        //某一年的一月一日为星期几，如果为星期一，则为一周开始，减0，如果为星期天，减1
        //将当前weekday获取到的星期几对应为[1,2,3,4,5,6,7(0)]
        //数组脚标为[0,1,2,3,4,5,6]
        //将获取到weekday作为脚标使用，生成的数组为reWeekday=[1,0,6,5,4,3,2]，reWeekday中存放要减去的天数
        if (reWeekday[weekday] != 0) {
            week += 1;
        }
        // console.log('-----allDay:'+allDay);
        // console.log('=============================weekday'+weekday+'reWeekday'+reWeekday[weekday]);
        if ((allDay - reWeekday[weekday]) % 7 == 0) {
            // console.log('-----allWeek:'+(week + (allDay - reWeekday[weekday]) / 7));
            return week + (allDay - reWeekday[weekday]) / 7;
        } else {
            // console.log('-----allWeek+1:'+(week + parseInt((allDay - reWeekday[weekday]) / 7) + 1));
            return week + parseInt((allDay - reWeekday[weekday]) / 7) + 1;
        }

    }

    //周对应的天数
    static getWeektoDays(year, week) {
        let days = 0;
        week -= 1;  //例week=44,第44周的第一天，应该为43周+1;
        const weekday = new Date(year + '-1-1').getDay();  //获取出一月份的第一天是星期几
        if (weekday != 1) {   //如果不是星期一
            days = (week - 1) * 7 + reWeekday[weekday] + 1;     //获取出天数 43周中如果第一周不是整周，减去相应的天数，
        } else {
            days = week * 7 + 1;      //   第44周第一天

        }
        return days;
    }


    //获取出某一周开始日期
    static getWeektoDate(year, week) {
        let days;
        let array = [];
        let monthDay = [];
        let startWeekDay;
        let endWeekDay;
        let thisMonth;
        let NextMonth;
        let NextYear = year;
        let monthDays;
        days = this.getWeektoDays(year, week);

        if (this.isLeapYear(year)) {      //是否为闰年
            array = leAllMonthsDays;
            monthDay = leEachMonthDays;
        } else {
            array = allMonthsDays;
            monthDay = eachMonthDays;
        }
        let bool = true;
        let i = 0;
        while (bool) {
            if (days <= array[i]) {
                bool = false;
            } else {
                i += 1;
            }
        }

        if (i == 0) {      //如果为一月
            startWeekDay = days;
        } else {
            startWeekDay = days - array[i - 1];    //当前天
        }

        if (days < 0) {               //日期为上一年
            startWeekDay = 31 + days;
            thisMonth = 12;
            NextMonth = 1;
            year -= 1;
            endWeekDay = days + 6;
        } else {
            thisMonth = i + 1;                   //当前月

            endWeekDay = startWeekDay + 6;       //一周跨度
            monthDays = monthDay[i];       //获取出当前月的天数

            if (endWeekDay > monthDays) {
                endWeekDay = endWeekDay - monthDays;
                NextMonth = thisMonth + 1;
                if (NextMonth > 12) {        //跨年
                    NextMonth = 1;
                    NextYear += 1;
                }
            } else {
                NextMonth = thisMonth;
            }
        }


        return year + '-' + thisMonth + '-' + startWeekDay + '--' + NextYear + '-' + NextMonth + '-' + endWeekDay;
    }


    //某一周是否合格，可选
    static weekIsEligible(year, week) {
        let days = this.getWeektoDays(year, week);
        let yearDays = this.isLeapYear(year) ? 366 : 365;
        if (days <= yearDays) {     //某一周的第一天在本年中
            return true;
        } else {
            return false;
        }
    }

    //判断某一周是否跨年
    static  weekAcrossYear(year, week) {
        let days = this.getWeektoDays(year, week);
        let yearDays = this.isLeapYear(year) ? 366 : 365;
        if (days <= yearDays) {     //某一周的第一天在本年中
            days += 6;
            if (days <= yearDays) {    //没有跨年
                return false;
            } else {
                return true;
            }
        }
    }

    //返回下一周
    static returnNextWeek(year, week) {
        // console.log('当前周'+week);
        let array = [0, 0];
        if (this.weekIsEligible(year, week)) {   //本周第一天在本年中
            if (!this.weekAcrossYear(year, week)) {    //false表示没有跨年    本周都在本年中
                if (this.weekIsEligible(year, week + 1)) {   //下一周的第一天在本年中
                    array[0] = year;
                    array[1] = week + 1;

                } else {    //下一周的第一天不在本年中
                    array[0] = year + 1;
                    array[1] = 1;
                }
            } else {
                array[0] = year + 1;
                array[1] = 2;
            }
        }
        return array;
    }

}



