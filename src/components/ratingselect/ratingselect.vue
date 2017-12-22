<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" @click="select(2)" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" @click="select(0)" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span class="block negative" @click="select(1)" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div class="switch">
      <span class="icon-check_circle" :class="{'on': onlyContent}" @click="toggleContent"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      selectType: {
        type: Number,
        defalut: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positive () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negative () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      select (type) {
        this.$emit('selecttype', type)
      },
      toggleContent () {
        this.$emit('content')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'

  .ratingselect
    .rating-type
      padding: 12px 0 18px 0
      border-1px(rgba(7,17,27,.1))
      font-size: 0px
      .block
        display: inline-block
        padding: 8px 12px
        border-radius: 2px
        font-size: 12px
        margin-right: 8px
        line-height: 16px
        &.positive
          background: rgba(0,160,220,.2)
          &.active
            background: rgb(0,160,220)
            color: #fff
        &.negative
          background: rgba(77,85,93,.2)
          &.active
            background: rgb(77,85,93)
            color: #fff
        .count
            font-size: 8px
            margin-left: 2px
    .switch
      padding-top: 12px
      color: rgb(147,153,159)
      line-height: 24px
      font-size: 0px
      .icon-check_circle
        display: inline-block
        font-size: 24px
        vertical-align: top
        margin-right: 4px
        &.on
          color: #00c850
      .text
        display: inline-block
        font-size: 12px
</style>
