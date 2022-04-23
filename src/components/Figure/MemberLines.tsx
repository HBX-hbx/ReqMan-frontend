import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./MemberLines.css";

interface MemberLinesProps {
  text: string; // text for parsing
  title: string; // chart title
}

const MemberLines = (props: MemberLinesProps) => {
  const ori_data = JSON.parse(props.text).data;
  // const test =
  //   '{"data":[{"commiter_name":"hxj","additions":10,"deletions":20},{"commiter_name":"glb","additions":20,"deletions":10},{"commiter_name":"wxy","additions":70,"deletions":0},{"commiter_name":"glb","additions":50,"deletions":30}]}';
  const data = JSON.parse(ori_data).data;
  const all_change: any = [];
  const all_add: any = [];
  const all_del: any = [];
  const all_name: string[] = [];
  data.forEach((item: any) => {
    const name = item.commiter_name;
    let exist = -1;
    for (let i = 0; i < all_name.length; i++) {
      if (name === all_name[i]) {
        exist = i;
        break;
      }
    }
    if (exist === -1) {
      all_name.push(name);
      const new_item = [item.additions + item.deletions];
      all_change.push(new_item);
    } else {
      all_change[exist].push(item.additions + item.deletions);
    }
  });
  const len = all_name.length;
  for (let i = 0; i < len; i++) {
    all_add.push([]);
    all_del.push([]);
  }
  data.forEach((item: any) => {
    const name = item.commiter_name;
    let exist = -1;
    for (let i = 0; i < all_name.length; i++) {
      if (name === all_name[i]) {
        exist = i;
        break;
      }
    }
    all_del[exist].push(item.deletions);
    all_add[exist].push(item.additions);
  });

  console.log(all_add);
  console.log(all_del);
  console.log(all_change);

  const option = {
    title: {
      text: props.title,
      left: "left",
    },
    legend: {
      data: ["平均增加行数", "平均减少行数", "平均修改行数"],
    },
    dataset: [
      {
        id: "add",
        source: all_add,
      },
      {
        id: "del",
        source: all_del,
      },
      {
        id: "change",
        source: all_change,
      },
      {
        fromDatasetId: "add",
        transform: {
          type: "boxplot",
          config: {
            itemNameFormatter: function (params: any) {
              return all_name[Number(params.value)];
            },
          },
        },
      },
      {
        fromDatasetId: "del",
        transform: {
          type: "boxplot",
          config: {
            itemNameFormatter: function (params: any) {
              return all_name[Number(params.value)];
            },
          },
        },
      },
      {
        fromDatasetId: "change",
        transform: {
          type: "boxplot",
          config: {
            itemNameFormatter: function (params: any) {
              return all_name[Number(params.value)];
            },
          },
        },
      },
    ],
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    yAxis: {
      type: "category",
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    xAxis: {
      type: "value",
      name: "修改行数",
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: "平均增加行数",
        type: "boxplot",
        datasetIndex: 3,
      },
      {
        name: "平均减少行数",
        type: "boxplot",
        datasetIndex: 4,
      },
      {
        name: "平均修改行数",
        type: "boxplot",
        datasetIndex: 5,
      },
    ],
  };
  return (
    <div className={"MemberLinesChart"}>
      <ReactEcharts option={option} />
    </div>
  );
};

export default MemberLines;
