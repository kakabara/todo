let app = {}

function pr(data){
    app.data = data;
    console.log(app);
}

function sendRequest(url, method, callback) {
    fetch(url, {method})
    .then( (response) => {return response.json();})
    .then( (data) => {callback(data);} )
    .catch( (err) => {console.warn(err);} )
}

sendRequest('http://127.0.0.1:5000/tasks', 'GET', pr);

