import ReactEcharts from "echarts-for-react";
import React, { Component } from "react";
import "./MemberLines.css";
import { useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";

interface MemberLinesProps {
  text: string; // text for parsing
  title: string; // chart title
}

const MemberLines = (props: MemberLinesProps) => {
  const data = JSON.parse(props.text);

  const projectStore = useSelector(getProjectStore);
  const allUserInfo = JSON.parse(projectStore).data.users;
  const all_name_id: number[] = [];
  const all_name: string[] = [];
  allUserInfo.forEach((value: any) => {
    all_name.push(value.name);
    all_name_id.push(value.id);
  });

  const max_len_per_row = 8;
  const new_all_names: string[] = [];
  all_name.forEach((value: string) => {
    if (value.length > max_len_per_row) {
      new_all_names.push(
        value.substring(0, max_len_per_row) +
          " \n" +
          value.substring(max_len_per_row)
      );
    } else {
      new_all_names.push(value + " ");
    }
  });

  const all_change: any = [];
  const all_add: any = [];
  const all_del: any = [];
  const len = all_name.length;
  for (let i = 0; i < len; i++) {
    all_add.push([]);
    all_del.push([]);
    all_change.push([]);
  }
  data.forEach((item: any, index: number) => {
    all_change[index] = item.commit_lines;
    // const id = item.user_committer;
    // for (let i = 0; i < all_name_id.length; i++) {
    //   if (all_name_id[i] === id) {
    //     all_change[i].push(item.additions + item.deletions);
    //     all_del[i].push(item.deletions);
    //     all_add[i].push(item.additions);
    //   }
    // }
  });

  for (let i = new_all_names.length - 1; i >= 0; i--) {
    if (all_change[i].length === 0) {
      new_all_names.splice(i, 1);
      all_change.splice(i, 1);
    }
  }

  const option = {
    title: {
      text: props.title,
      left: "left",
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
              return new_all_names[Number(params.value)];
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
              return new_all_names[Number(params.value)];
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
              return new_all_names[Number(params.value)];
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
    xAxis: {
      type: "category",
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        rotate: "30",
      },
    },
    yAxis: {
      type: "value",
      name: "修改行数",
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: "修改行数极值",
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
