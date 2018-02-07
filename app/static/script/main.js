const sendRequest = (method, url) => {
    return fetch(url, {method})
    .then( (response) => { response.json().then( (data) => { return data});})
    .then( ans => {return ans;} )
    .catch( (error) =>
        {console.warn(error);} );
}

var req = sendRequest('GET', 'http://127.0.0.1:5000/tasks');
console.log(req);


