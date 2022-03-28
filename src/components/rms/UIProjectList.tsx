import React, { useState } from "react";
import { Input, Modal, Space, Tag, Button, DatePicker } from "antd";
import "./UIProjectList.css";
import ProList from "@ant-design/pro-list";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { ProjectInfo } from "../../store/ConfigureStore";
import moment from "moment";
const { TextArea } = Input;

interface ProjectListProps {
  readonly userInfo: string;
}

const UIProjectList = (props: ProjectListProps) => {
  // 总任务列表
  const ProjectList = JSON.parse(props.userInfo).data.projects;
  const dispatcher = useDispatch();
  const dataProjectList: ProjectInfo[] = [];
  ProjectList.forEach((value: any, index: number) => {
    dataProjectList.push({
      id: value.id,
      title: value.title,
      description: value.description,
      invitation: value.invitation,
      createdAt: value.createdAt * 1000,
      image:
        "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
    });
  });
  const [tableListDataSource, settableListDataSource] =
    useState<ProjectInfo[]>(dataProjectList);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newInvite, setNewInvite] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={"prjlist"}>
      <ProList<ProjectInfo>
        toolBarRender={() => {
          return [
            <Button onClick={showModal} key="add" type="primary">
              新建项目
            </Button>,
          ];
        }}
        onRow={(record: ProjectInfo) => {
          return {
            onClick: () => {
              console.log(record);
            },
          };
        }}
        rowKey="name"
        headerTitle="项目列表"
        split={true}
        dataSource={tableListDataSource}
        metas={{
          title: {
            render: (record: any, item: ProjectInfo) => (
              <a
                style={{
                  color: "black",
                  fontSize: "20px",
                }}
                onClick={() => {
                  console.log("title clicked");
                }}
              >
                {item.title}
              </a>
            ),
          },
          avatar: {
            dataIndex: "image",
          },
          subTitle: {
            render: (record: any, item: ProjectInfo) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: "5px",
                  }}
                >
                  <Space size={0}>
                    <Tag color="green">
                      创建时间：
                      {moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                    </Tag>
                  </Space>
                </div>
              );
            },
          },
          content: {
            render: (record: any, item: ProjectInfo) => (
              <div
                style={{
                  width: "100%",
                  marginLeft: "200px",
                  fontSize: "15px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                }}
              >
                <ReactMarkdown children={item.description} />
              </div>
            ),
          },
          actions: {
            render: () => {
              return [<a key="init">邀请</a>];
            },
          },
        }}
      />
      <Modal
        title="添加新项目"
        centered={true}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目名称
        </p>
        <Input
          placeholder="请输入"
          onChange={(e) => {
            setNewTitle(e.target.value);
          }}
        />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目邀请码
        </p>
        <Input
          placeholder="Input"
          onChange={(e) => {
            setNewInvite(e.target.value);
          }}
        />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目介绍
        </p>
        <TextArea
          rows={4}
          onChange={(e) => {
            setNewDesc(e.target.value);
          }}
        />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          创建日期
        </p>
        <DatePicker
          style={{ width: "50%" }}
          onChange={(date: moment, datestring: string) => {
            setNewDate(date.unix());
          }}
        />
      </Modal>
    </div>
  );
};

export default UIProjectList;
