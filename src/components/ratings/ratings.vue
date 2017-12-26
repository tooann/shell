<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-child">
      <div class="rating-wrapper">
        <div class="rating-left">
          <div class="score">{{seller.score}}</div>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="rating-right">
            <div class="score-wrapper">
              <span class="title">服务态度</span>
              <star :size="24" :score="seller.serviceScore"></star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrapper">
              <span class="title">商品评分</span>
              <star :size="24" :score="seller.foodScore"></star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrapper">
              <span class="title">送达时间</span>
              <span class="time">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
      <div class="split"></div>
      <ratingselect :ratings="ratings" :select-type="selectType" :only-content="onlyContent" @selecttype="selecttype" @content="content"></ratingselect>
      <div class="rating-content">
        <ul>
          <li v-for="rating in ratings" class="rating-item border-1px" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content-wrapper">
              <div class="name">{{rating.username}}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <div class="text">{{rating.text}}</div>
              <div class="recommend" v-show="rating.recommend">
                <span class="icon-thumb_up" v-show="rating.recommend && rating.recommend.length"></span>
                <span  v-for="item in rating.recommend" class="recommend-item">{{item}}</span>
              </div>
              <div class="rate-time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from '../../components/star/star.vue'
import ratingselect from '../../components/ratingselect/ratingselect'
import {formatDate} from '../../common/js/formatDate.js'
import data from '../../common/json/data.json'

const ALL = 2
// const ERR_OK = 0
// const debug = process.env.NODE_ENV !== 'production'

export default {
  props: {
    seller: Object
  },
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true
    }
  },
  created () {
//    const url = debug ? '/api/ratings' : 'http://ustbhuangyi.com/sell/api/ratings'
//    this.$http.get(url).then((response) => {
//      response = response.data
//      if (response.errno === ERR_OK) {
//        this.ratings = response.data
//        this.$nextTick(() => {
//          if (!this.ratingScroll) {
//            this.ratingScroll = new BScroll(this.$refs.ratings, {
//              click: true
//            })
//          } else {
//            this.ratingScroll.refresh()
//          }
//        })
//      }
//    })
    this.ratings = data.ratings
    this.$nextTick(() => {
      if (!this.ratingScroll) {
        this.ratingScroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      } else {
        this.ratingScroll.refresh()
      }
    })
  },
  filters: {
    formatDate (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    selecttype (type) {
      this.selectType = type
      // 手动刷新better-scroll重新计算页面高度
      this.$nextTick(() => {
        this.ratingScroll.refresh()
      })
    },
    content () {
      this.onlyContent = !this.onlyContent
      // 手动刷新better-scroll重新计算页面高度
      this.$nextTick(() => {
        this.ratingScroll.refresh()
      })
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  components: {
    star,
    ratingselect
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .ratings
    position: absolute
    top: 176px
    left: 0
    bottom: 0
    right: 0
    margin: 0 auto
    max-width: 540px
    overflow: hidden
    .rating-wrapper
      padding: 18px 0
      display: flex
      .rating-left
        flex: 0 0 137px
        width: 137px
        padding: 6px 0
        text-align: center
        border-right: 1px solid rgba(7,17,27,0.1)
        .score
          font-size: 24px
          line-height: 28px
          color: rgb(255,153,0)
          margin-bottom: 6px
        .title
          font-size: 12px
          line-height: 12px
          color: rgb(7,17,27)
          margin-bottom: 8px
        .rank
          font-size: 10px
          line-height: 10px
          color: rgb(147,153,159)
      .rating-right
        flex: 1
        padding-left: 24px
        .score-wrapper
          font-size: 0
          margin-bottom: 8px
          line-height: 18px
          .title
            display: inline-block
            font-size: 12px
            color: rgb(7,17,27)
          .star
            margin-left: 12px
            display: inline-block
          .score
            margin-left: 12px
            font-size: 12px
            color: rgb(255,153,0)
        .delivery-wrapper
           font-size: 0
           .title
             display: inline-block
             font-size: 12px
             color: rgb(7,17,27)
           .time
             margin-left: 12px
             display: inline-block
             font-size: 12px
             color: rgb(147,153,159)
    .split
      height: 16px
      border-top: 1px solid rgba(7,17,27,0.1)
      border-bottom: 1px solid rgba(7,17,27,0.1)
      background: #f3f5f7
    .ratingselect
      padding: 18px 18px 12px 18px
      border-bottom: 1px solid rgba(7,17,27,.1)
    .rating-content
      padding: 0 18px
      .rating-item
        position: relative
        display: flex
        padding: 18px 0
        border-1px(rgba(7,17,27,.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content-wrapper
          flex: 1
          .name
            font-size: 10px
            line-height: 12px
            color: rgb(7,17,27)
            margin-bottom: 4px
          .star-wrapper
            font-size: 0
            margin-bottom: 6px
            .star
              display: inline-block
              margin-right: 6px
            .time
              font-size: 10px
              font-weight: 200
              line-height: 12px
              color: rgb(147,153,159)
          .text
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
            margin-bottom: 8px
          .recommend
            font-size: 0
            .icon-thumb_up
              display: inline-block
              font-size: 12px
              color: rgb(0,160,220)
              line-height: 16px
            .recommend-item
              display: inline-block
              padding: 0 6px
              font-size: 9px
              line-height: 16px
              color: rgb(147,153,159)
              border: 1px solid rgba(7,17,27,.1)
              margin: 0 0 4px 8px
          .rate-time
            position: absolute
            right: 18px
            top: 18px
            font-size: 10px
            line-height: 12px
            color: rgb(147,153,159)


</style>
