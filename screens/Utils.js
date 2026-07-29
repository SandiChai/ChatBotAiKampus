import React from 'react';
import {
    Alert,
    Platform,
} from 'react-native';
import moment from 'moment';

export default class Utils extends React.Component
{
    static currencyfunc = (_number) => 
    {
        return _number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    
    static calculateDate = (start_date, end_date) => 
    {
        var valuestart_date = moment(start_date).format("DD").valueOf();;
        var valueend_date = moment(end_date).format("DD").valueOf();
        var timeLapse = parseInt(valuestart_date) - parseInt(valueend_date)
        return parseInt(timeLapse) ;
    }

    static calculateDateBackup = (start_date, end_date) => 
    {
        var valuestart_date = moment(start_date).valueOf();
        var valueend_date = moment(end_date).valueOf();
        var timeLapse = moment(valuestart_date).diff(valueend_date, 'days')
        return parseInt(timeLapse) ;
    }

    static renderIf = (condition, content) =>
    {
        if(condition){
            return content;
        }
        else{
            return null;
        }
    }

    static errAlert = (_title, _msg) => {
        return Platform.OS =="web" ? alert(_msg) : Alert.alert(
            _title,
            _msg,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
        )
    }

    static validityEmail = (_text) => {
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        return regex.test(_text);
    }

    static getNameStatus = (_language, _status) => 
    {
        var nameStatus = "";
        if(_language == "Indonesia"){
            if(_status == "pending"){
                nameStatus = "Menunggu Review"
            }else if(_status == "processing"){
                nameStatus = "Proses Survey : ASO"
            }else if(_status == "approved"){
                nameStatus = "Diterima Proses CA : SBO"
            }else if(_status == "live"){
                nameStatus = "Go Live"
            }else if(_status == "rejected"){
                nameStatus = "Pengajuan Ditolak"
            }else if(_status == "cancelled"){
                nameStatus = "Pengajuan Dibatalkan"
            }else if(_status == "paid"){
                nameStatus = "Komisi Dicairkan"
            }
        }else{
            if(_status == "pending"){
                nameStatus = "Waiting for Reviews"
            }else if(_status == "processing"){
                nameStatus = "In Survey Process : ASO"
            }else if(_status == "approved"){
                nameStatus = "Accepted CA Process : SBO"
            }else if(_status == "live"){
                nameStatus = "Go Live"
            }else if(_status == "rejected"){
                nameStatus = "Submission Rejected"
            }else if(_status == "cancelled"){
                nameStatus = "Submission Canceled"
            }else if(_status == "paid"){
                nameStatus = "Commission Disbursed"
            }
        }
        return nameStatus;
    }

    static getMonthNameIN = (_index) => 
    {
        var weekday = new Array(12);
        weekday[0] = "Januari";
        weekday[1] = "Februari";
        weekday[2] = "Maret";
        weekday[3] = "April";
        weekday[4] = "Mei";
        weekday[5] = "Juni";
        weekday[6] = "Juli";
        weekday[7] = "Agustus";
        weekday[8] = "September";
        weekday[9] = "Oktober";
        weekday[10] = "November";
        weekday[11] = "Dessember";
        weekday[12] = "Semua Bulan";
        return weekday[_index];
    }

    static getMonthNameEN = (_index) => 
    {
        var weekday = new Array(12);
        weekday[0] = "January";
        weekday[1] = "February";
        weekday[2] = "March";
        weekday[3] = "April";
        weekday[4] = "May";
        weekday[5] = "June";
        weekday[6] = "July";
        weekday[7] = "August";
        weekday[8] = "September";
        weekday[9] = "October";
        weekday[10] = "November";
        weekday[11] = "December";
        weekday[12] = "All Months";
        return weekday[_index];
    }

    static getDayNameIN = (_index) => 
    {
        var weekday = new Array(7);
        weekday[0] = "Minggu";
        weekday[1] = "Senin";
        weekday[2] = "Selasa";
        weekday[3] = "Rabu";
        weekday[4] = "Kamis";
        weekday[5] = "Jumat";
        weekday[6] = "Sabtu";
        return weekday[_index];
    }

    static getDayNameEN = (_index) => 
    {
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        return weekday[_index];
    }
}
