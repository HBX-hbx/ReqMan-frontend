import React, { ReactElement, useEffect, useState } from "react";
import type { ProColumns } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import {
  Input,
  Button,
  Modal,
  Progress,
  InputNumber,
  Popconfirm,
  message,
  Space,
} from "antd";
import { IRCard, SRCard } from "../../store/ConfigureStore";
import "./UIIRList.css";
import SRList from "./UISRList";
import { useDispatch, useSelector } from "react-redux";
import {
  createIRInfo,
  deleteIRInfo,
  updateIRInfo,
} from "../../store/functions/RMS";
import { ToastMessage } from "../../utils/Navigation";
import ReactMarkdown from "react-markdown";
const { TextArea } = Input;

interface UIIRListProps {
  readonly project_id: number;
  readonly IRListStr: string;
  readonly userInfo: string;
  readonly SRListStr: string;
  readonly IRSRAssociation: string;
  readonly onlyShow: boolean;
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
  console.log("into it!");
  const IRListData = JSON.parse(props.IRListStr).data;
  const dispatcher = useDispatch();
  const project = props.project_id;
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
  });
  // const [tableListDataSource] = useState<IRCard[]>(dataIRList);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isCreateModalVisible, setIsCreateModalVisible] =
    useState<boolean>(false);
  const [isSRModalVisible, setIsSRModalVisible] = useState<boolean>(false);

  const [id, setId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [rank, setRank] = useState<number>(1);

  const showSRModal = (record: IRCard) => {
    setId(record.id);
    setIsSRModalVisible(true);
  };

  const handleSROk = () => {
    setId(-1);
    // setTimeout(() => window.location.reload(), 1000);
    ToastMessage("success", "关联成功", "您的IR-SR关联成功");
    setIsSRModalVisible(false);
  };

  const handleSRCancel = () => {
    setId(-1);
    // setTimeout(() => window.location.reload(), 0);
    setIsSRModalVisible(false);
  };

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
        // setTimeout(() => window.location.reload(), 1000);
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
    setIsCreateModalVisible(true);
  };

  const handleCreateOk = () => {
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
    createIRInfo(dispatcher, project, newIR).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "创建成功", "您的IR创建成功");
        // setTimeout(() => window.location.reload(), 1000);
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

  function confirmDelete(record: IRCard) {
    deleteIRInfo(dispatcher, project, record).then((data: any) => {
      if (data.code === 0) {
        ToastMessage("success", "删除成功", "您的IR删除成功");
        // setTimeout(() => window.location.reload(), 1000);
        setId(-1);
        setTitle("");
        setDesc("");
        setRank(1);
        setIsCreateModalVisible(false);
      } else {
        ToastMessage("error", "删除失败", "您的IR删除失败");
      }
    });
  }

  const columns: ProColumns<IRCard>[] = [
    {
      title: "IR标题",
      width: "15%",
      dataIndex: "title",
      align: "center",
    },
    {
      title: "任务描述",
      width: "25%",
      dataIndex: "description",
      align: "center",
      render: (_, record) => (
        <ReactMarkdown className={"markdown"} children={record.description} />
      ),
    },
    {
      title: "进度",
      width: "13%",
      align: "center",
      render: (_, record) => (
        <Progress className={"prgressProp"} percent={50} />
      ),
    },
    {
      title: "创建者",
      width: "12%",
      dataIndex: "createdBy",
      align: "center",
    },
    {
      title: "创建时间",
      width: "15%",
      dataIndex: "createdAt",
      valueType: "dateTime",
      align: "center",
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: "操作",
      width: "20%",
      valueType: "option",
      align: "center",
      render: (text, record, _, action) => [
        // 编辑内含修改删除等，须继续与后端接口适配
        <a onClick={() => showEditModal(record)}>编辑</a>,
        <Popconfirm
          title="你确定要删除该原始需求吗？"
          onConfirm={() => confirmDelete(record)}
          okText="是"
          cancelText="否"
        >
          <a href="#">删除</a>
        </Popconfirm>,
        <a onClick={() => showSRModal(record)}>关联功能需求</a>,
      ],
    },
  ];

  console.log(dataIRList);

  // const [table, setTable] = useState<ReactElement>();
  // useEffect(() => {
  //   setTable(<div></div>);
  // }, [1]);

  return (
    <div className={`IRTable`}>
      <ProTable<IRCard>
        headerTitle="原始需求列表"
        toolBarRender={() => {
          return [
            <Button key="create" onClick={showCreateModal} type="primary">
              新建原始需求
            </Button>,
          ];
        }}
        columns={columns}
        // request={() => {
        //   return Promise.resolve({
        //     data: tableListDataSource,
        //     success: true,
        //   });
        // }}
        dataSource={dataIRList}
        rowKey="id"
        pagination={false}
        scroll={{ y: 350 }}
        dateFormatter="string"
        search={false}
      />
      <Modal
        title="功能需求关联列表"
        centered={true}
        visible={isSRModalVisible}
        onCancel={handleSRCancel}
        footer={[
          <Button key="confirm" onClick={handleSROk}>
            确认
          </Button>,
        ]}
        width={"70%"}
      >
        <SRList
          showChoose={true}
          project_id={props.project_id}
          SRListStr={props.SRListStr}
          userInfo={props.userInfo}
          IRSRAssociation={props.IRSRAssociation}
          IR_id={id}
        />
      </Modal>

      <Modal
        title="新增原始需求"
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
        {/*<p*/}
        {/*  style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}*/}
        {/*>*/}
        {/*  项目重要性*/}
        {/*</p>*/}
        {/*<InputNumber*/}
        {/*  value={rank}*/}
        {/*  onChange={(e: number) => {*/}
        {/*    setRank(e);*/}
        {/*  }}*/}
        {/*/>*/}
      </Modal>

      <Modal
        title="编辑原始需求"
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
        {/*<p*/}
        {/*  style={{ paddingTop: "10px", marginBottom: "5px", fontSize: "16px" }}*/}
        {/*>*/}
        {/*  项目重要性*/}
        {/*</p>*/}
        {/*<InputNumber*/}
        {/*  value={rank}*/}
        {/*  onChange={(e: number) => {*/}
        {/*    setRank(e);*/}
        {/*  }}*/}
        {/*/>*/}
      </Modal>
    </div>
  );
};

export default UIIRList;
