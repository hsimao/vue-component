

new Vue({
    el: '#app',
    data: {
        data: [],
        location: [],
        stared: [],
        filter: ''
    },
    methods: {
        getData(){
            const _this = this;
            const api = 'http://opendata2.epa.gov.tw/AQI.json';

            $.getJSON(api, function(data){
                _this.data = data
                console.log(data)
            })
        }
    },
    created(){
        this.getData()
    }
})