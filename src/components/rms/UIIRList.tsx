import React, { useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { Input, Button, Modal, Progress, InputNumber } from "antd";
import { IRCard } from "../../store/ConfigureStore";
import "./UIIRList.css";
import SRList from "./UISRList";
import { useDispatch } from "react-redux";
import {
  createIRInfo,
  deleteIRInfo,
  updateIRInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
const { TextArea } = Input;

interface UIIRListProps {
  readonly project_id: number;
  readonly IRListStr: string;
  readonly userInfo: string;
}

/*
IRListData example:
[
  {id: 1, project: 2, title: 'I am the first IR', description: 'hahahahahahah', rank: 1, ...}
  {id: 1, project: 2, title: 'I am the first IR', description: 'hahahahahahah', rank: 1, ...}
  {id: 1, project: 2, title: 'I am the first IR', description: 'hahahahahahah', rank: 1, ...}
]
*/

const UIIRList = (props: UIIRListProps) => {
  const IRListData = JSON.parse(props.IRListStr).data;
  // const userData = JSON.parse(props.userInfo);
  const dispatcher = useDispatch();
  // console.log(IRListData);
  let project = -1;
  const dataIRList: IRCard[] = [];
  IRListData.forEach((value: IRCard) => {
    dataIRList.push({
      id: value.id,
      project: value.project,
      title: value.title,
      description: value.description,
      rank: value.rank,
      createdBy: value.createdBy,
      createdAt: value.createdAt * 1000,
      disabled: value.disabled,
    });
    project = value.project;
  });
  const [tableListDataSource] = useState<IRCard[]>(dataIRList);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);

  const [id, setId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [rank, setRank] = useState<number>(1);

  const showEditModal = (record: IRCard) => {
    setId(record.id);
    setTitle(record.title);
    setDesc(record.description);
    setRank(record.rank);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    const newIR: IRCard = {
      id: id,
      project: project,
      title: title,
      description: desc,
      rank: rank,
      createdBy: "", // 未用到
      createdAt: -1, // 未用到
      disabled: true, // 未用到
    };
    updateIRInfo(dispatcher, project, newIR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "修改成功", "您的IR修改成功");
        setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setRank(1);
        setIsEditModalVisible(false);
      } else {
        ToastMessage("error", "修改失败", "您的IR修改失败");
      }
    });
  };

  const handleEditCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setRank(1);
    setIsEditModalVisible(false);
  };

  const showCreateModal = () => {
    console.log("I am here");
    setIsCreateModalVisible(true);
  };

  const handleCreateOk = () => {
    const newIR: IRCard = {
      id: -1,
      project: project,
      title: title,
      description: desc,
      rank: rank,
      createdBy: "", // 未用到
      createdAt: -1, // 未用到
      disabled: true, // 未用到
    };
    createIRInfo(dispatcher, project, newIR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "创建成功", "您的IR创建成功");
        setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setRank(1);
        setIsCreateModalVisible(false);
      } else {
        ToastMessage("error", "创建失败", "您的IR创建失败");
      }
    });
  };

  const handleCreateCancel = () => {
    setId(-1);
    setTitle("");
    setDesc("");
    setRank(1);
    setIsCreateModalVisible(false);
  };

  const columns: ProColumns<IRCard>[] = [
    {
      title: "IR标题",
      width: 100,
      dataIndex: "title",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      render: (_) => <a>{_}</a>,
    },
    {
      title: "任务描述",
      width: 240,
      dataIndex: "description",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
    },
    {
      title: "进度",
      width: 80,
      align: "center",
      editable: false,
      // test
      render: (_, record) => <Progress percent={50} />,
    },
    {
      title: "创建者",
      width: 80,
      dataIndex: "createdBy",
      align: "center",
      editable: false,
    },
    {
      title: "创建时间",
      width: 110,
      dataIndex: "createdAt",
      valueType: "dateTime",
      align: "center",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项",
          },
        ],
      },
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: "操作",
      width: 100,
      valueType: "option",
      align: "center",
      render: (text, record, _, action) => [
        // 编辑内含修改删除等，须继续与后端接口适配
        <a onClick={() => showEditModal(record)}>编辑</a>,
        <a
          onClick={() => {
            console.log("删除");
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <div className={`IRTable`}>
      <ProTable<IRCard>
        headerTitle="原始需求列表"
        toolBarRender={() => {
          return [
            <Button key="create" onClick={showCreateModal} type="primary">
              新建IR
            </Button>,
          ];
        }}
        columns={columns}
        request={() => {
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        dateFormatter="string"
        search={false}
      />

      {/*<Modal*/}
      {/*  title="SR 任务关联列表"*/}
      {/*  centered={true}*/}
      {/*  visible={isSRModalVisible}*/}
      {/*  onOk={handleSROk}*/}
      {/*  onCancel={handleSRCancel}*/}
      {/*  width={"70%"}*/}
      {/*>*/}
      {/*  <SRList*/}
      {/*    showChoose={true}*/}
      {/*    myIRKey={modalIRKey}*/}
      {/*    curSRKey={modalSRKey}*/}
      {/*    project_id={Number(props.project_id)}*/}
      {/*    SRListStr={""}*/}
      {/*    userInfo={props.userInfo}*/}
      {/*  />*/}
      {/*</Modal>*/}

      <Modal
        title="新增IR任务"
        centered={true}
        visible={isCreateModalVisible}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
        width={"70%"}
      >
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目名称
        </p>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目介绍
        </p>
        <TextArea
          rows={4}
          allowClear
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目重要性
        </p>
        <InputNumber
          value={rank}
          onChange={(e: number) => {
            setRank(e);
          }}
        />
      </Modal>
      <Modal
        title="编辑IR项"
        centered={true}
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        width={"70%"}
      >
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目名称
        </p>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目介绍
        </p>
        <TextArea
          rows={4}
          allowClear
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        />
        <p
          style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}
        >
          项目重要性
        </p>
        <InputNumber
          value={rank}
          onChange={(e: number) => {
            setRank(e);
          }}
        />
      </Modal>
    </div>
  );
};

export default UIIRList;
