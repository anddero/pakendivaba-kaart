document.addEventListener('DOMContentLoaded', async function () {
    loadMapsApi(MAPS_API_KEY);

    getAllSheetData().then(data => {
        // TODO kmere Instead of print, populate map layer
        console.log("All sheet data: ", data);
    });
});
