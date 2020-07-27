

export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date) { }


    get token() {
        const tokenExpired = new Date() > this._tokenExpirationDate;
        if (!this._tokenExpirationDate || tokenExpired) {
            return null;
        }
        return this._token;
    }
}
