// $(".selectDateUnit").bind('click',function(event){
//   $(".selectDateUnit").forEach(function(item){
//     $(item).removeClass("active");
//   });
//   $(this).addClass("active");
// });

var Scene = {};
Scene.extend = function (o) {
    return o;
}
Array.prototype.remove = function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    this.splice(dx,1); 
} 

var fsbox = Scene.extend({
  isLoading: false,
  timer: null,
  gatherData: {
    gatherdayData:{},
    gatherweekData:{},
    gathermonthData:{},
    gatherquarterData:{},
    gatheryearData:{},
  },
  init: function() {
    var self = this;
    self.getboxdata();
    self.rendergather();
    self.timer = setInterval(function() {
      if (self.isLoading)
        return;
        self.getboxdata();
    }, 360000);
  },
  getboxdata: function () {
    var self = this;
      if(self.isLoading) 
        return;
      self.isLoading = true;
      param = `datetime'${getnow()}'`;
    $.ajax({
          url: `/sap/opu/odata/sap/LSDCP2_SDSUM1_SRV/LSDCP2_SDSUM1(IP_DATE_SINGLE=${param})/Results?$format=json`,
          type : "get",
          dataType : "json",
          // contentType: 'application/json',
          // data: JSON.stringify(param),
          success: function (data) {
              console.log('success! gatherData', data);
              self.isLoading = false;
              var gatherData = data.d.results[0];
              self.changegatherdata(gatherData);
          },
          error: function (erro) {
             console.log('failed!', erro)
             function fresh() {
                self.isLoading = false;
                setTimeout(self.getboxdata(), 10000)
             }
             funcconfirm(fresh,'数据加载失败！是否重新加载？')
          }
      });
  },
  changegatherdata: function(gatherData) {
     this.gatherData.gatherdayData = Object.assign({}, {'salemoney': formateMoney(gatherData.A00O2TKFSDLCRS24Y27881093G, 0), 'salebuget': formateMoney(gatherData.A00O2TKFSDLCRS24Y278810FF0, 0), 'reach': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y278810LQK, 1), 'yty': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y2788114P8, 1)})
     this.gatherData.gatherweekData = Object.assign({}, {'salemoney': formateMoney(gatherData.A00O2TKFSDLCRS24Y278811B0S, 0), 'salebuget': formateMoney(gatherData.A00O2TKFSDLCRS24Y278811HCC, 0), 'reach': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y278811NNW, 1), 'yty': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y2788126MK, 1)})
     this.gatherData.gathermonthData = Object.assign({}, {'salemoney': formateMoney(gatherData.A00O2TKFSDLCRS24Y278812CY4, 0), 'salebuget': formateMoney(gatherData.A00O2TKFSDLCRS24Y278812J9O, 0), 'reach': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y278812PL8, 1), 'yty': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y2788138JW, 1)})
     this.gatherData.gatherquarterData = Object.assign({}, {'salemoney': formateMoney(gatherData.A00O2TKFSDLCRS24Y278813EVG, 0), 'salebuget': formateMoney(gatherData.A00O2TKFSDLCRS24Y278813L70, 0), 'reach': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y278813RIK, 1), 'yty': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y278814AH8, 1)})
     this.gatherData.gatheryearData = Object.assign({}, {'salemoney': formateMoney(gatherData.A00O2TKFSDLCRS24Y278814GSS, 0), 'salebuget': formateMoney(gatherData.A00O2TKFSDLCRS24Y278814N4C, 0), 'reach': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y278814TFW, 1), 'yty': percentValueUnit(gatherData.A00O2TKFSDLCRS24Y278815CEK, 1)})
      this.initialgather(this.gatherData.gatherdayData);      
  },
  initialgather: function (gatherData) {
      var danwei1 = '￥', danwei2 = '';
      $('#fsdropcontent1 .fsbox1 h3:first').html(`${danwei1}${gatherData.salemoney}`);
      $('#fsdropcontent1 .fsbox1 h3:last').html(`${danwei1}${gatherData.salebuget}`);
      $('#fsdropcontent1 .fsbox2 h3:first').html(`${gatherData.reach}${danwei2}`);
      $('#fsdropcontent1 .fsbox2 h3:last').html(`${gatherData.yty}${danwei2}`);
  },
  rendergather: function() {
      var _this = this; 
      var fsdrop1 = '#fsdrop1';
      var fsdrop1title = '#fsdrop1title'
      var gatherpick = function () {
          $(`${fsdrop1} li`).click(function (e) { 
          e.preventDefault();//阻止a链接的跳转行为 
          var $this = $(this);
          _this.pickitem($this, '每日', _this.gatherData.gatherdayData)
          _this.pickitem($this, '每周', _this.gatherData.gatherweekData)
          _this.pickitem($this, '每月', _this.gatherData.gathermonthData)
          _this.pickitem($this, '每季', _this.gatherData.gatherquarterData)
          _this.pickitem($this, '每年', _this.gatherData.gatheryearData)
        })
      }
     fsdrop(_this,fsdrop1, fsdrop1title, gatherpick);
    //   _this =  fsdrop(_this,fsdrop1, fsdrop1title, gatherpick);
      // this.fsdrop.call(fsbox,fsdrop1, fsdrop1title, this.gatherData);
  },
  pickitem: function(pointer, item, data) {
      if (pointer.find('a').html() === item) {
          pointer.tab('show');//显示当前选中的链接及关联的content 
          this.initialgather(data)
      }
  }
})

var fschart =Scene.extend({
    isLoading: false,
    timer: null,
    chartdaydata: {
        Date1: [],
        salereach: [],
        saleYTY: [],
      },
    chartweekdata: {
        Date1: [],
        salereach: [],
        saleYTY: [],
      },
    chartmonthdata: {
        Date1: [],
        salereach: [],
        saleYTY: [],
      },
    init: function() {
      var self = this;
      self.getchartdata();
      self.renderchart();
      self.timer = setInterval(function() {
        if (self.isLoading)
          return;
          self.getchartdata();
      }, 360000);
    },
    getchartdata: function() {
        var self = this;
      if(self.isLoading) 
        return;
      self.isLoading = true;
      param = `datetime${getnow()}`;

    $.ajax({
          url: `/sap/opu/odata/sap/LSDCP2_SDSUM4_SRV/LSDCP2_SDSUM4Results?$format=json`,
          type : "get",
          dataType : "json",
          // contentType: 'application/json',
          // data: JSON.stringify(param),
          success: function (data) {
              console.log('success! chartData', data);
              self.isLoading = false;
              var chartData = data.d.results;
              self.changechartdata(chartData);
          },
          error: function (erro) {
             console.log('failed!', erro)
             function fresh() {
                self.isLoading = false;
                setTimeout(self.getchartdata(), 10000)
             }
             funcconfirm(fresh,'数据加载失败！是否重新加载？')
          }
      });
    },
    pickitem: function(pointer, item, data, max, min, interval) {
      if (pointer.find('a').html() === item) {
          pointer.tab('show');//显示当前选中的链接及关联的content 
          this.initialchart(data, max, min, interval);
      }
    },
    initialchart: function(chartdata, max, min, interval) {
        var FsChart = echarts.init(document.getElementById('manageReportday'));
        var datax = [];
        var datayl = [];
        var datayr = [];
        chartdata.Date1.forEach(function(item) {
            datax.push({value: item, textStyle: {
                fontFamily: 'SourceHanSansCn-Regular',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: 20,
                color: '#000000'
            }})
        })
        chartdata.salereach.forEach(function(item) {
            datayl.push({value: item, textStyle: {
                fontFamily: 'SourceHanSansCn-Regular',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: 20,
                color: '#000000'
            }})
        })
        chartdata.saleYTY.forEach(function(item) {
            datayr.push({value: item, textStyle: {
                fontFamily: 'SourceHanSansCn-Regular',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: 20,
                color: '#000000'
            }})
        })
        this.getFsChart(FsChart, datax, datayl, datayr, max, min, interval);
    },
    renderchart: function() {
        var _this = this;
        var fsdrop2 = '#fsdrop2';
        var fsdrop2title = '#fsdrop2title'
        var chartpick = function () {
            $(`${fsdrop2} li`).click(function (e) { 
            e.preventDefault();//阻止a链接的跳转行为 
            var $this = $(this);
            _this.pickitem($this, '每日', _this.chartdaydata, 100, -50, 10)
            _this.pickitem($this, '每周', _this.chartweekdata, 100, -50, 10)
            _this.pickitem($this, '每月', _this.chartmonthdata, 100, -50, 10)
            })
        }
        fsdrop(_this, fsdrop2, fsdrop2title, chartpick)
    },
    getFsChart: function (FsChart, datax, datayl, datayr, max, min, interval) {
        // 指定图表的配置项和数据
        FsOption = {
            tooltip: {
                trigger: 'axis',
                padding: [20, 10, 20, 10],
                textStyle: {
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: 22,
                    color: '#ffffff'
                }
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data:[{name: '销售达成', textStyle: {
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 24,
                        color: '#333333'
                    },},{name: '销售同比', textStyle: {
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 24,
                        color: '#333333'
                    },}],
            },
            xAxis: [
                {
                    type: 'category',
                    data: datax, 
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '销售达成单位:%',
                    nameTextStyle: {
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 22
                    },
                    // min,
                    // max,
                    // interval,
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: 20
                        }
                    }
                },
                {
                    type: 'value',
                    name: '销售同比单位:%',
                    nameTextStyle: {
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        fontSize: 22
                    },
                    // min,
                    // max,
                    // interval,
                    axisLabel: {
                        formatter: '{value}',
                        textStyle: {
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontSize: 20
                        }
                    }
                }
            ],
            series: [
                {
                    name:'销售达成',
                    type:'line',
                    data: datayl,
                    barWidth: 30,
                    lineStyle: {
                        normal: {
                            color: '#fd6804',
                            width: 3
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#fd6804',
                            borderWidth: 1
                        }
                    }
                },
                {
                    name:'销售同比',
                    type:'bar',
                    yAxisIndex: 1,
                    data: datayr,
                    barWidth: 40,
                    itemStyle: {
                        normal: {
                            color: function(param) {
                            // build a color map as your need.
                            var colorList = [];
                            datayr.forEach(its => {
                                if (its > 0) {
                                    colorList.push('#fdae04');
                                } else {
                                    colorList.push('#168bea');
                                }
                            })
                            return colorList[param.dataIndex]
                        },
                        }
                    }
                }
            ]
        };
        FsChart.setOption(FsOption);
    },
    pickchartdata: function (chartData, sortname, unit) { 
      var _this = this;
      var chartdataTemp = {
        Date1: [],
        salereach: [],
        saleYTY: [],
      };
      chartData.forEach(function(item, index) {
        if (item.LMDSDTYPE_T === sortname && item.LSDSHOPID__LMDFBID_T === '' && item.LMDPRTYPE === '') {
         chartdataTemp.Date1.push(item.LMDATVA_T + unit);
         chartdataTemp.salereach.push(percentValue(item.A00O2TKFSDLCTICX154A4LI4SQ, 1));
         chartdataTemp.saleYTY.push(percentValue(item.A00O2TKFSDLCTICX154A4LINRE, 1));
        }
      });
      return chartdataTemp
    },
    changechartdata: function (chartData) {
      this.chartdaydata = this.pickchartdata(chartData, 'Day', '日');
      this.chartweekdata = this.pickchartdata(chartData, 'Week', '周');
      this.chartmonthdata = this.pickchartdata(chartData, 'Month', '月');
      this.initialchart(this.chartdaydata, 100, -50, 10)
    },
})

var fstable = Scene.extend({
  isLoading: false,
  isLoading1: false,
  isLoading2: false,
  timer: null,
  fstabledata: [],
  tabledata: {
    tabledaydata: [],
    tableweekdata: [],
    tablemonthdata: [],
    tablequarterdata: [],
    tableyeardata: [],
  },
  init: function () {
    var self = this;
    self.gettabledata1(self.changetabledata1);
    self.rendertable()
    self.timer = setInterval(function() {
      if (self.isLoading)
        return;
        self.gettabledata1(self.changetabledata1);
    }, 360000);
  },
  rendertable: function() {
        var _this = this;
        var fsdrop3 = '#fsdrop3';
        var fsdrop3title = '#fsdrop3title'
        // fsdrop(fsdrop3, fsdrop3title);
        var tablepick = function () {
          $(`${fsdrop3} li`).click(function (e) { 
          e.preventDefault();//阻止a链接的跳转行为 
          var $this = $(this);
          var $table = $('#tabletab1table1');
          _this.pickitem($table, $this, '每日', _this.tabledata.tabledaydata)
          _this.pickitem($table, $this, '每周', _this.tabledata.tableweekdata)
          _this.pickitem($table, $this, '每月', _this.tabledata.tablemonthdata)
          _this.pickitem($table, $this, '每季', _this.tabledata.tablequarterdata)
          _this.pickitem($table, $this, '每年', _this.tabledata.tableyeardata)
        })
      }
        fsdrop(_this,fsdrop3, fsdrop3title, tablepick);
        fstabletab('#tabletab1', _this);
        // fstabletab('#tabletab2');
        // fstabletab('#tabletab3');
  },
  pickitem: function(table, pointer, item, data) {
      if (pointer.find('a').html() === item) {
          pointer.tab('show');//显示当前选中的链接及关联的content 
          this.initTable(table, data);
      }
  },
  changetabledata1: function (_this, fstabledata) {
      var $table = $('#tabletab1table1');
      _this.cleardata();
      console.log('fstabledata', fstabledata)
      fstabledata.forEach(function(item, index) {
        _this.tabledata.tabledaydata.push({'id': index, 'name': item.LMDDEPSD__LMDFBID_T, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24LJUEDA9J2C, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24LJUEDA9CQS, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24QA8M39EV2X, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24MTUA0ZH21E, 1)})
        _this.tabledata.tableweekdata.push({'id': index, 'name': item.LMDDEPSD__LMDFBID_T, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24LJUEDAAKZO, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24LJUEDAA8CK, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24QONT76VQJO, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24QONT76VK84, 1)})
        _this.tabledata.tablemonthdata.push({'id': index, 'name': item.LMDDEPSD__LMDFBID_T, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24LJUEDABMX0, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24LJUEDABA9W, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24QONT76W36S, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24QONT76VWV8, 1)})
        _this.tabledata.tablequarterdata.push({'id': index, 'name': item.LMDDEPSD__LMDFBID_T, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24LJUEDACOUC, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24LJUEDACC78, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24QONT76WFTW, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24QONT76W9IC, 1)})
        _this.tabledata.tableyeardata.push({'id': index, 'name': item.LMDDEPSD__LMDFBID_T, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24LJUEDAEMDG, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24LJUEDADE4K, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24QONT76WSH0, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24QONT76WM5G, 1)})
      })
        _this.initTable($table, _this.tabledata.tabledaydata);
    },
    changetabledata2: function (_this, fstabledata) {
        var $table = $('#tabletab1table1');
        _this.cleardata();
        fstabledata.forEach(function(item, index) {
            _this.tabledata.tabledaydata.push({'id': index, 'name': item.LMDDEPOP__LMDPRTYPE, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24X20J60L3RM, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24X20J60KXG2, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24X20J60LT1U, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24X20J60LA36, 1)})
            _this.tabledata.tableweekdata.push({'id': index, 'name': item.LMDDEPOP__LMDPRTYPE, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24X20J60M5OY, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24X20J60LZDE, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24X20J60MUZ6, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24X20J60MC0I, 1)})
            _this.tabledata.tablemonthdata.push({'id': index, 'name': item.LMDDEPOP__LMDPRTYPE, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24X20J60N7MA, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24X20J60N1AQ, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24X20J60NWWI, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24X20J60NDXU, 1)})
            _this.tabledata.tablequarterdata.push({'id': index, 'name': item.LMDDEPOP__LMDPRTYPE, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24X20J60O9JM, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24X20J60O382, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24X20J60OYTU, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24X20J60OFV6, 1)})
            _this.tabledata.tableyeardata.push({'id': index, 'name': item.LMDDEPOP__LMDPRTYPE, 'salemoney': formateMoney(item.A00O2TKFSDLCRS24X20J60PBGY, 2), 'salebuget': formateMoney(item.A00O2TKFSDLCRS24X20J60P55E, 2), 'yty': percentValueUnit(item.A00O2TKFSDLCRS24X20J60Q0R6, 1), 'reach': percentValueUnit(item.A00O2TKFSDLCRS24X20J60PHSI, 1)})
        })
            _this.initTable($table, _this.tabledata.tabledaydata);
    },
    gettabledata1: function (changetabledata) {
      var self = this;
      if(self.isLoading1) 
        return;
      self.isLoading1 = true;
      self.isLoading = true;
      $(`#tabletab1 a:first`).tab('show');
      var param = `datetime'${getnow()}'`;

    $.ajax({
          url: `/sap/opu/odata/sap/LSDCP2_SDSUM2_SRV/LSDCP2_SDSUM2(IP_DATE_SINGLE=${param})/Results?$format=json`,
          type : "get",
          dataType : "json",
          // contentType: 'application/json',
          // data: JSON.stringify(param),
          success: function (data) {
              console.log('success! gettabledata', data);
              var fstabledata = data.d.results;
              self.isLoading1 = false;
              if (!self.isLoading2) 
              self.isLoading = false;
              self.isLoading2 = false;
              changetabledata(self, fstabledata);
          },
          error: function (erro) {
             console.log('failed!', erro);
             function fresh() {
                self.isLoading1 = false;
                if (!self.isLoading2) 
                self.isLoading = false;
                setTimeout(self.gettabledata1(), 10000)
             }
             funcconfirm(fresh,'数据加载失败！是否重新加载？')
          }
      });
    },
    gettabledata2: function (changetabledata) {
      var self = this;
      if(self.isLoading2) 
        return;
      self.isLoading2 = true;
      self.isLoading = true;
      var param = `datetime'${getnow()}'`;

    $.ajax({
          url: `/sap/opu/odata/sap/LSDCP2_SDSUM3_SRV/LSDCP2_SDSUM3(IP_DATE_SINGLE=${param})/Results?$format=json`,
          type : "get",
          dataType : "json",
          // contentType: 'application/json',
          // data: JSON.stringify(param),
          success: function (data) {
              console.log('success! gettabledata', data);
              var fstabledata = data.d.results;
              self.isLoading2 = false;
              if (!self.isLoading1)
              self.isLoading = false;
              self.isLoading1 = false;
              changetabledata(self, fstabledata);
          },
          error: function (erro) {
             console.log('failed!', erro);
             function fresh() {
                self.isLoading2 = false;
                if (!self.isLoading1)
                self.isLoading = false;
                setTimeout(self.gettabledata2(), 10000)
             }
             funcconfirm(fresh,'数据加载失败！是否重新加载？')
          }
      });
    },
    cleardata: function() {
        this.tabledata.tabledaydata = [];
        this.tabledata.tableweekdata = [];
        this.tabledata.tablemonthdata = [];
        this.tabledata.tablequarterdata = [];
        this.tabledata.tableyeardata = [];
    },
     initTable:function(table, data) {
        const _this = this;
        var $table = table;
        $table.bootstrapTable({
            // height: 860,
            classes: 'table table-hover table-bordered fstable',
              columns: [
                [
                    {
                        field: 'id',
                        title: 'Item ID',
                        align: 'center',
                        valign: 'center',
                        visible: false
                    }, 
                    {
                        field: 'name',
                        title: '名称',
                        width: '20%',
                        align: 'center',
                        valign: 'center',
                        // cellStyle: _this.cellStyle(value, row, index, field)
                        // cellStyle: function (value, row, index, field) {
                        //     if (value === 'item6') {
                        //         return {
                        //             // classes: 'text-nowrap another-class',
                        //             css: {"color": "blue", "font-size": "20px"}
                        //         };
                        //     } else {
                        //         return {}
                        //     }
                                
                        //     }
                    }, 
                    {
                        field: 'salemoney',
                        title: '销售金额',
                        width: '20%',
                        align: 'center',
                        valign: 'center',
                        // cellStyle: _this.cellStyle(value, row, index, field)
                        // cellStyle: function (value, row, index, field) {
                        //     if (value === 'item6') {
                        //         return {
                        //             // classes: 'text-nowrap another-class',
                        //             css: {"color": "blue", "font-size": "20px"}
                        //         };
                        //     } else {
                        //         return {}
                        //     }
                                
                        //     }
                    }, 
                    {
                        field: 'salebuget',
                        title: '销售预算',
                        width: '20%',
                        align: 'center',
                        valign: 'center',
                        // cellStyle: _this.cellStyle(value, row, index, field)
                        // cellStyle: function (value, row, index, field) {
                        //     if (value === 'item6') {
                        //         return {
                        //             // classes: 'text-nowrap another-class',
                        //             css: {"color": "blue", "font-size": "20px"}
                        //         };
                        //     } else {
                        //         return {}
                        //     }
                                
                        //     }
                    }, 
                    {
                        field: 'yty',
                        title: '销售同比',
                        width: '20%',
                        align: 'center',
                        valign: 'center',
                        // cellStyle: _this.cellStyle(value, row, index, field)
                        cellStyle: function (value, row, index, field) {
                            if (value > '0' && value !== '0%') {
                                return {
                                    // classes: 'text-nowrap another-class',
                                    css: {"font-size": "26px", 'height': '60px', 'line-height': '50px', 'background': `url('/fivestarchart/image/common/arrow_up.png') no-repeat 85% 23px`}
                                };
                            } else if (value === '0%'){
                                return {
                                    // classes: 'text-nowrap another-class',
                                    css: {"font-size": "26px", 'height': '60px', 'line-height': '50px', 'margin-right': '40px'}
                                };
                            } else {
                                return {
                                    // classes: 'text-nowrap another-class',
                                    css: {"font-size": "26px", 'height': '60px', 'line-height': '50px', 'margin-right': '40px', 'background': `url('/fivestarchart/image/common/arrow_down.png') no-repeat 85% 23px`}
                                };
                            }
                                
                        }
                    }, 
                    {
                        field: 'reach',
                        title: '销售达成',
                        width: '20%',
                        align: 'center',
                        valign: 'center',
                        cellStyle: function (value, row, index, field) {
                            var currentvalue = Number.parseFloat(value.replace('%', ''));
                            if (currentvalue > 100) {
                                return {
                                    css: {"font-size": "26px", 'height': '60px', 'line-height': '50px', 'background': `url('/fivestarchart/image/common/arrow_up.png') no-repeat 85% 23px`}
                                };
                            } else if (currentvalue === 100){
                                return {
                                    css: {"font-size": "26px", 'height': '60px', 'line-height': '50px', 'margin-right': '40px'}
                                };
                            } else {
                                return {
                                    css: {"font-size": "26px", 'height': '60px', 'line-height': '50px', 'margin-right': '40px', 'background': `url('/fivestarchart/image/common/arrow_down.png') no-repeat 85% 23px`}
                                };
                            }
                                
                        }
                    }
                ]
              ],
            pagination: false,
            showHeader: true,
            // striped: true,
            // url:"./data/tabledata.json",
            data: data,
            rowStyle : function (row, index) {
                    if (row.id%2 === 0) {
                        return {
                            css: {"color": "#333333", "font-size": "26px", "height": '60px', 'line-height': '50px' ,'background-color': '#fff'}
                        };
                    } else {
                        return {
                          css: {"color": "#333333", "font-size": "26px", "height": '60px', 'line-height': '50px', 'background-color': '#fffad7'}
                        }
                    }
                },
            // method: "get", //使用get请求到服务器获取数据 
            // url: "<c:url value='/SellServlet?act=ajaxGetSellRecord'/>"
            // queryParamsType : "undefined", 
            // queryParams: function queryParams(params) { //设置查询参数 
            //   var param = { 
            //   pageNumber: params.pageNumber, 
            //   pageSize: params.pageSize, 
            //   orderNum : $("#orderNum").val() 
            //   }; 
            //   return param;     
            // }, 
            // onLoadSuccess: function(data){ //加载成功时执行 
            //    this.changetabledata(data);
            // }, 
            // onLoadError: function(){ //加载失败时执行 
            //   // layer.msg("加载数据失败", {time : 1500, icon : 2}); 
            // } 
            // }); 
        });
        setTimeout(function () {
            $table.bootstrapTable('resetView');
            $table.bootstrapTable('load',data); 
        }, 200);
        $table.bootstrapTable('hideLoading', 'none');
        
    },
    cellStyle: function(value, row, index, field) {
        if (value === 'item6') {
            return {
                // classes: 'text-nowrap another-class',
                css: {"color": "blue", "font-size": "26px"}
            };
        } else {
            return {}
        }
            
    },
})

function fsdrop(_this, fsdrop, fsdroptitle, pickdatafun) {
       $(`${fsdrop} li:first`).tab('show');//初始化显示哪个tab 
      pickdatafun();
      $(`${fsdroptitle}`).bind('click', function (e) {
          e.preventDefault();
          $(`${fsdroptitle} span`).removeClass('glyphicon-chevron-down');
          $(`${fsdroptitle} span`).addClass('glyphicon-chevron-up');
          $(`${fsdrop}`).toggleClass('hide');
      }) 
        $(`${fsdrop} li`).bind('click', function (e) {
          e.preventDefault();
          var value = $(this).find('a').html()
          $(`${fsdrop}`).toggleClass('hide');
          $(`${fsdroptitle} a`).html(value);
          $(`${fsdroptitle} span`).removeClass('glyphicon-chevron-up');
          $(`${fsdroptitle} span`).addClass('glyphicon-chevron-down');
      }) 
  }
function fstabletab(tabletab, _this) {
    $('#branch').click(function(e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        _this.gettabledata1(_this.changetabledata1);
        
    })
    $('#category').click(function(e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        _this.gettabledata2(_this.changetabledata2);

    })
  }

// 公用函数

//获取昨天时间
function getnow() {
    function p(s) {
        return s < 10 ? '0' + s: s;
    }
    var myDate = new Date();
    //获取当前年
    var year=myDate.getFullYear();
    //获取当前月
    var month=myDate.getMonth()+1;
    //获取昨天
    var date=myDate.getDate() - 1; //当前时间的前一天 
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    var s=myDate.getSeconds(); 
    var now = year + '-' + p(month) + '-' + p(date) + 'T' + p(h) + ':' + p(m) + ':' + p(s);
    return now;
}

//保留小数
function fsTofixed(number, point) {
    return Math.floor(number * Math.pow(10, point)) / (Math.pow(10, point));
}
//百分比+小数位数
function percentValue(number, point) {
    var value = Math.floor(number * Math.pow(10, point + 2)) / Math.pow(10, point);
    return value;
}
//百分比+小数位数附带百分号
function percentValueUnit(number, point) {
    return percentValue(number, point).toString().concat('%');
}
//单位化万元带万元名
function formateMoneyName(number) {
    var value = (fsTofixed(number/(Math.pow(10, 4)), 2));
    return !!value ? value.toString().concat('万元') : value;
}
//单位化万元不带万元名
function formateMoney(number, point) {
   return fsTofixed(number/(Math.pow(10, 4)), point);
}

//confirm 函数
  function funcconfirm(func, message){
  var r=confirm(message)
  if (r==true)
    {func();}
  }
//类别选项

function compare(propertyName) {
	return function (object1, object2) {
	var value1 = object1[propertyName]; 
	var value2 = object2[propertyName]; 
		if (value2 < value1) { 
			return -1; 
		} 
		else if (value2 > value1) { 
			return 1; 
		} 
		else { 
			return 0; 
		} 
	}
}


function compare2(propertyName) {
	return function (object1, object2) {
	var value1 = object1[propertyName]; 
	var value2 = object2[propertyName]; 
		if (value2 < value1) { 
			return 1; 
		} 
		else if (value2 > value1) { 
			return -1; 
		} 
		else { 
			return 0; 
		} 
	}
}
 fsbox.init();
 fschart.init();
 fstable.init();


