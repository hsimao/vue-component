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
        // 過濾重複名稱
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
            <div class="cards-tool">
                <h3 class="title">關注城市</h3>
            </div>
            <div class="cards follow">
                <div class="card" :class="statusColor(item.Status)" v-for="item in filterFollow">
                    <div class="card-top">
                        <div class="card-title">{{item.County}} - {{item.SiteName}}</div>
                        <div class="card-star-box" :class="{'active' : followActive(item.SiteName)}" @click="followToggle(item.SiteName)">
                            <i class="star"></i>
                            <i class="star-active"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <div class="card-aqi">AQI {{item.AQI}}</div>
                        <div class="card-pm">PM2.5 {{item['PM2.5']}}</div>
                        <div class="card-status">空氣狀況 {{item.Status}}</div>
                        <div class="card-time">更新時間 {{item.PublishTime}}</div>
                    </div>
                </div>
            </div>
            <div class="cards">
                <div class="card" :class="statusColor(item.Status)" v-for="item in datas">
                    <div class="card-top">
                        <div class="card-title">{{item.County}} - {{item.SiteName}}</div>
                        <div class="card-star-box" :class="{'active' : followActive(item.SiteName)}" @click="followToggle(item.SiteName)">
                            <i class="star"></i>
                            <i class="star-active"></i>
                        </div>
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
    data(){
        return {
            filterCity: ['基隆','汐止', '士林', '左營'],
            current: ''
        }
    },
    props: ['datas'],
    methods: {
        statusColor(type){
            if (type === '良好') return 'color-1'
            if (type === '普通') return 'color-2'
            if (type === '對敏感族群不健康') return 'color-3'
            if (type === '對所有族群不健康') return 'color-4'
            if (type === '非常不健康') return 'color-4'
            if (type === '危害') return 'color-1'
        },
        followActive(city){
            return this.filterCity.some((item)=>{
                return item === city
            })
        },
        followToggle(target){
            if (this.filterCity.some((item)=>item ===target)) {
                this.filterCity.splice(this.filterCity.indexOf(target), 1)
            } else {
                this.filterCity.push(target)
            }
        }
    },
    computed: {
        filterFollow(){
            const citys = []
            for (let i=0; i < this.filterCity.length; i++) {
                this.datas.forEach((item)=>{
                    if (item.SiteName === this.filterCity[i]) citys.push(item)
                })
            }
            return citys
        }
    }
})


// 色卡組件
Vue.component('color-card', {
    template: `
        <ul class="colors">
            <li class="title">空污色卡</li>
            <li class="color color-1"><span>良好</span></li>
            <li class="color color-2"><span>普通</span></li>
            <li class="color color-3"><span>對敏感族群不健康</span></li>
            <li class="color color-4"><span>對所有族群不健康</span></li>
            <li class="color color-5"><span>非常不健康</span></li>
            <li class="color color-6"><span>危害</span></li>
        </ul>
    `,
    methods: {
        makeCenter(el){
            const boxH = el.offsetHeight
            const viewH = document.documentElement.clientHeight || document.body.clientHeight
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            // 算換元素需要top多少才能置中的值: (螢幕高度 - 元素整體高度) / 2
            const top = (viewH - boxH) / 2
            TweenMax.to(el, 1, {
                top: top + scrollTop,   // 更新元素top位置 : 置中高度 + 目前滾動距離
                ease: Power4.easeOut
            })
        },
    },
    mounted(){
        const _this = this
        const el = document.getElementsByClassName('colors')[0]
        console.log(el)
        window.addEventListener('scroll',()=>{
            this.makeCenter(el)
        })
    }
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
    computed: {

    },
    created(){
        this.getData()
    }
})