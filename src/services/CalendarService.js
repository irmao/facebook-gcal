class CalendarService {
    constructor(props) {
        self.fs = require('fs');
        self.readline = require('readline');
        self.google = require('googleapis');
        self.googleAuth = require('google-auth-library');
        
        // If modifying these scopes, delete your previously saved credentials
        // at ~/.credentials/calendar-nodejs-quickstart.json
        self.SCOPES = ['https://www.googleapis.com/auth/calendar'];
        self.TOKEN_PATH = '../../calendar-token.json';
    }
}

export default CalendarService;