import { Modal, Select, Space, Tag, Typography } from "antd";
import React, { useState } from "react";
import "./UIMergeCard.css";
import { MergeRequestProps } from "../../store/ConfigureStore";
import { userId2UserInfo } from "../../utils/Association";
import { useDispatch, useSelector } from "react-redux";
import { getProjectStore } from "../../store/slices/ProjectSlice";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  createMRSRAssociation,
  deleteMRSRAssociation,
} from "../../store/functions/RDTS";
import { getRepoStore } from "../../store/slices/RepoSlice";

interface UIMergeCardProps {
  data: string;
  SRListStore: string;
  MRSRAssociationStore: string;
  visible: boolean;
  close: () => void;
}

interface UIMergeCardPreviewProps {
  SRListStore: string;
  MRSRAssociationStore: string;
  data: string;
}

const UIMergeCard = (props: UIMergeCardProps) => {
  const dispatcher = useDispatch();
  const params = useParams<"id">();
  const project_id = Number(params.id);

  const projectStore = useSelector(getProjectStore);
  const repoStore = useSelector(getRepoStore);

  const data: MergeRequestProps = JSON.parse(props.data);
  const [mrId, setMrId] = useState(data.id);

  const getBackgroundColor = (state: "closed" | "merged" | "opened") => {
    switch (state) {
      case "closed":
        return "#ffe5e5";
      case "merged":
        return "#e5ffe5";
      case "opened":
        return "#e5e5ff";
    }
  };

  const getMergeState = (state: "closed" | "merged" | "opened") => {
    switch (state) {
      case "closed":
        return "已关闭";
      case "merged":
        return "已合并";
      case "opened":
        return "正在审核";
    }
  };

  let authoredBy = data.authoredByUserName;
  if (data.user_authored > 0) {
    const find_result = userId2UserInfo(data.user_authored, projectStore);
    if (find_result !== "not_found") {
      authoredBy = find_result.name;
    }
  }

  let reviewedBy = data.reviewedByUserName;
  if (data.user_reviewed > 0) {
    const find_result = userId2UserInfo(data.user_reviewed, projectStore);
    if (find_result !== "not_found") {
      reviewedBy = find_result.name;
    }
  }

  let currAssociatedSRId = -1;
  // console.debug(JSON.parse(props.MRSRAssociationStore).data);
  const filtered_list = JSON.parse(props.MRSRAssociationStore).data.filter(
    (asso: any) => asso.MR === mrId
  );
  if (filtered_list.length > 0) {
    currAssociatedSRId = filtered_list[0].SR;
  }

  const onSRAssociatedChange = (val: string) => {
    const key = Number(val);
    if (currAssociatedSRId > 0) {
      console.debug(currAssociatedSRId);
      deleteMRSRAssociation(
        dispatcher,
        project_id,
        mrId,
        currAssociatedSRId,
        repoStore
      ).then((data: any) => {
        console.debug(key);
        if (data.code === 0 && key !== Number(-1)) {
          createMRSRAssociation(dispatcher, project_id, mrId, key, repoStore);
        }
      });
    } else {
      createMRSRAssociation(dispatcher, project_id, mrId, key, repoStore);
    }
  };

  return (
    <Modal
      centered={true}
      footer={null}
      destroyOnClose={true}
      visible={props.visible}
      onCancel={() => props.close()}
      width={"70%"}
      title={"合并请求查看"}
    >
      <div className={"meta-data"}>
        <Typography.Title level={4}>{data.title}</Typography.Title>
        <div>
          <span className={"meta-data-label"}>合并请求描述</span>
          <p style={{ marginLeft: "1rem" }}>
            {data.description === "" ? data.title : data.description}
          </p>
        </div>
        <div>
          <span className={"meta-data-label"}>合并请求状态</span>
          <Space>
            <Tag
              color={getBackgroundColor(data.state)}
              style={{
                color: "black",
                marginLeft: "1rem",
                fontWeight: "bold",
                padding: "0.2rem 0.5rem",
              }}
            >
              {getMergeState(data.state)}
            </Tag>
          </Space>
        </div>
        <div>
          <span className={"meta-data-label"}>合并请求发起人</span>
          <span style={{ marginLeft: "1rem" }}>{authoredBy}</span>
          &nbsp;&nbsp;
          <span>@&nbsp;&nbsp;{moment(data.authoredAt * 1000).calendar()}</span>
        </div>
        {data.state === "merged" ? (
          <div>
            <span className={"meta-data-label"}>合并请求负责人</span>
            <span style={{ marginLeft: "1rem" }}>{reviewedBy}</span>
            &nbsp;&nbsp;
            <span>
              @&nbsp;&nbsp;{moment(data.reviewedAt * 1000).calendar()}
            </span>
          </div>
        ) : null}
        <div>
          <span className={"meta-data-label"} style={{ marginRight: "1rem" }}>
            关联功能需求
          </span>
          <Select
            showSearch={true}
            style={{ width: "20rem" }}
            placeholder="功能需求"
            optionFilterProp="children"
            onChange={onSRAssociatedChange}
            defaultValue={currAssociatedSRId.toString()}
            filterOption={(input, option: any) =>
              option.children.indexOf(input.toLowerCase()) >= 0
            }
          >
            <Select.Option value="-1">　</Select.Option>
            {JSON.parse(props.SRListStore).data.map((sr: any) => (
              <Select.Option key={sr.id} value={sr.id.toString()}>
                {sr.title}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

const UIMergeCardPreview = (props: UIMergeCardPreviewProps) => {
  const data = JSON.parse(props.data);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <UIMergeCard
        data={props.data}
        visible={visible}
        close={() => setVisible(false)}
        MRSRAssociationStore={props.MRSRAssociationStore}
        SRListStore={props.SRListStore}
      />
      <a onClick={() => setVisible(true)}>{data.title}</a>
    </>
  );
};

export { UIMergeCard, UIMergeCardPreview };
