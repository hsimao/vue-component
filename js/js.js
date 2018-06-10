// select組件
Vue.component('select-component', {
    template: `
    <select name="" id="">
        <option value="">請選擇城市</option>
        <option value="" v-for="item in filterCity">{{item.County}}</option>
    </select>
    `,
    data(){
        return {
            city: ''
        }
    },
    props: ['citys'],
    computed: {
        filterCity(){
            const citys = [...this.citys]
            for (let i=0; i<citys.length; i++) {
                for (let j=i+1; j<citys.length; j++) {
                //arr[i] 前面與後面進行比較
                    if (citys[i].County == citys[j].County) {
                        citys.splice(j,1); //將後面刪除
                        j--;  //因為刪除會讓arr.length減少,所以需要退回位置
                    }
                }
            }
            return citys
        }
    }
})

// card 組件
Vue.component('card-component', {
    template: `
        <div>
            <div class="cards">
                <div class="card" v-for="item in datas">
                    <div class="card-top">
                        <div class="card-title">{{item.County}} - {{item.SiteName}}</div>
                        <div class="card-star"></div>
                    </div>
                    <div class="card-info">
                        <div class="card-aqi">AQI {{item.AQI}}</div>
                        <div class="card-pm">PM2.5 {{item['PM2.5']}}</div>
                        <div class="card-status">空氣狀況 {{item.Status}}</div>
                        <div class="card-time">更新時間 {{item.PublishTime}}</div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['datas']
})


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
                console.log(data[0])
            })
        }
    },
    created(){
        this.getData()
    }
})