window.fire = async function (fnName) {
    console.log("fire()", fnName);
    return firebase.functions().httpsCallable(fnName)()
        .then(result => result.data)
        .catch(error => console.error(fnName, error));
};
