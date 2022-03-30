import request_json from "../../utils/Network";
import API from "../../utils/APIList";
import { getServiceStore, updateServiceStore } from "../slices/ServiceSlice";
import {
  updateIRListStore,
  updateSRListStore,
  updateIRSRStore,
} from "../slices/IRSRSlice";
import {
  IRCard,
  Iteration,
  SRCard,
  IRSRAssociation,
  SRIteration,
  UserIteration,
} from "../ConfigureStore";
import {
  updateIterationStore,
  updateSRIterationStore,
  updateUserIterationStore,
} from "../slices/IterationSlice";

const getIRListInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "ir",
  };
  const IRList_data = await request_json(API.GET_RMS, { getParams: myParams });
  // console.log("IRList: " + JSON.stringify(IRList_data));
  dispatcher(updateIRListStore(JSON.stringify(IRList_data)));
};

const createIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCard
): Promise<void> => {
  console.log(ir);
  const myBody = {
    project: ir.project,
    type: "ir",
    operation: "create",
    data: {
      updateData: {
        title: ir.title,
        description: ir.description,
        rank: ir.rank,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIRListInfo(dispatcher, project_id);
};

const updateIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCard
): Promise<void> => {
  const myBody = {
    project: ir.project,
    type: "ir",
    operation: "update",
    data: {
      id: ir.id,
      updateData: {
        title: ir.title,
        description: ir.description,
        rank: ir.rank,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIRListInfo(dispatcher, project_id);
};

const deleteIRInfo = async (
  dispatcher: any,
  project_id: number,
  ir: IRCard
): Promise<void> => {
  const myBody = {
    project: ir.project,
    type: "ir",
    operation: "delete",
    data: {
      id: ir.id,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIRListInfo(dispatcher, project_id);
};

const updateServiceInfo = async (dispatcher: any, project_id: number) => {
  request_json(API.GET_RMS, {
    getParams: { project: project_id, type: "service" },
  }).then((data) => dispatcher(updateServiceStore(JSON.stringify(data))));
};

const doUpdateServiceInfo = async (
  dispatcher: any,
  project_id: number,
  info: any
) => {
  return request_json(API.POST_RMS, {
    body: {
      project: project_id,
      type: "service",
      operation: "update",
      data: {
        id: info.id,
        updateData: {
          title: info.title,
          description: info.description,
        },
      },
    },
  }).then((data) => {
    updateServiceInfo(dispatcher, project_id);
    return data;
  });
};

const deleteServiceInfo = async (
  dispatcher: any,
  project_id: number,
  info: any
) => {
  return request_json(API.POST_RMS, {
    body: {
      project: project_id,
      type: "service",
      operation: "delete",
      data: {
        id: info.id,
      },
    },
  }).then((data) => {
    updateServiceInfo(dispatcher, project_id);
    return data;
  });
};

const getSRListInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "sr",
  };
  const SRList_data = await request_json(API.GET_RMS, { getParams: myParams });
  // console.log("IRList: " + JSON.stringify(IRList_data));
  dispatcher(updateSRListStore(JSON.stringify(SRList_data)));
};

const createSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCard
): Promise<void> => {
  console.log(sr);
  const myBody = {
    project: sr.project,
    type: "sr",
    operation: "create",
    data: {
      updateData: {
        title: sr.title,
        description: sr.description,
        priority: sr.priority,
        rank: sr.rank,
        state: sr.currState, // "TODO" "WIP" "Reviewing" "Done" 四选一
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 SR 的 store
  getSRListInfo(dispatcher, project_id);
};

const updateSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCard
): Promise<void> => {
  const myBody = {
    project: sr.project,
    type: "sr",
    operation: "update",
    data: {
      id: sr.id,
      updateData: {
        title: sr.title,
        description: sr.description,
        priority: sr.priority,
        rank: sr.rank,
        state: sr.currState, // "TODO" "WIP" "Reviewing" "Done" 四选一
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getSRListInfo(dispatcher, project_id);
};

const deleteSRInfo = async (
  dispatcher: any,
  project_id: number,
  sr: SRCard
): Promise<void> => {
  const myBody = {
    project: sr.project,
    type: "sr",
    operation: "delete",
    data: {
      id: sr.id,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getSRListInfo(dispatcher, project_id);
};

const getIterationInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "iteration",
  };
  const Iteration_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateIterationStore(JSON.stringify(Iteration_data)));
};

const createIteration = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<void> => {
  console.log(iteration);
  const myBody = {
    project: iteration.project,
    type: "iteration",
    operation: "create",
    data: {
      updateData: {
        title: iteration.title,
        sid: iteration.sid,
        begin: iteration.begin.toFixed(1),
        end: iteration.end.toFixed(1),
      },
    },
  };
  console.log("create Iteration: " + myBody.data.updateData.begin);
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getIterationInfo(dispatcher, project_id);
};

const updateIterationInfo = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<void> => {
  const myBody = {
    project: iteration.project,
    type: "iteration",
    operation: "update",
    data: {
      id: iteration.id,
      updateData: {
        title: iteration.title,
        sid: iteration.sid,
        begin: iteration.begin,
        end: iteration.end,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIterationInfo(dispatcher, project_id);
};

const deleteIterationInfo = async (
  dispatcher: any,
  project_id: number,
  iteration: Iteration
): Promise<void> => {
  const myBody = {
    project: iteration.project,
    type: "iteration",
    operation: "delete",
    data: {
      id: iteration.id,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIterationInfo(dispatcher, project_id);
};

const getIRSRInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "ir-sr",
  };
  const IRSRAssociation_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateIRSRStore(JSON.stringify(IRSRAssociation_data)));
};

const createIRSR = async (
  dispatcher: any,
  project_id: number,
  IRSRAssociation: IRSRAssociation
): Promise<void> => {
  console.log(IRSRAssociation);
  const myBody = {
    project: project_id,
    type: "ir-sr",
    operation: "create",
    data: {
      updateData: {
        IRId: IRSRAssociation.IRId,
        SRId: IRSRAssociation.SRId,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getIRSRInfo(dispatcher, project_id);
};

const deleteIRSR = async (
  dispatcher: any,
  project_id: number,
  IRSRAssociation: IRSRAssociation
): Promise<void> => {
  const myBody = {
    project: project_id,
    type: "ir-sr",
    operation: "delete",
    data: {
      IRId: IRSRAssociation.IRId,
      SRId: IRSRAssociation.SRId,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getIRSRInfo(dispatcher, project_id);
};

const getSRIterationInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "sr-iteration",
  };
  const SRIteration_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateSRIterationStore(JSON.stringify(SRIteration_data)));
};

const createSRIteration = async (
  dispatcher: any,
  project_id: number,
  SRIteration: SRIteration
): Promise<void> => {
  console.log(SRIteration);
  const myBody = {
    project: project_id,
    type: "sr-iteration",
    operation: "create",
    data: {
      updateData: {
        iterationId: SRIteration.iterationId,
        SRId: SRIteration.SRId,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getSRIterationInfo(dispatcher, project_id);
};

const deleteSRIteration = async (
  dispatcher: any,
  project_id: number,
  SRIteration: SRIteration
): Promise<void> => {
  const myBody = {
    project: project_id,
    type: "sr-iteration",
    operation: "delete",
    data: {
      iterationId: SRIteration.iterationId,
      SRId: SRIteration.SRId,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getSRIterationInfo(dispatcher, project_id);
};

const getUserIterationInfo = async (
  dispatcher: any,
  project_id: number
): Promise<void> => {
  const myParams = {
    project: project_id,
    type: "user-iteration",
  };
  const UserIteration_data = await request_json(API.GET_RMS, {
    getParams: myParams,
  });
  dispatcher(updateUserIterationStore(JSON.stringify(UserIteration_data)));
};

const createUserIteration = async (
  dispatcher: any,
  project_id: number,
  UserIteration: UserIteration
): Promise<void> => {
  console.log(UserIteration);
  const myBody = {
    project: project_id,
    type: "user-iteration",
    operation: "create",
    data: {
      updateData: {
        iterationId: UserIteration.iterationId,
        userId: UserIteration.userId,
      },
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  // 更新 Iteration 的 store
  getUserIterationInfo(dispatcher, project_id);
};

const deleteUserIteration = async (
  dispatcher: any,
  project_id: number,
  UserIteration: UserIteration
): Promise<void> => {
  const myBody = {
    project: project_id,
    type: "user-iteration",
    operation: "delete",
    data: {
      iterationId: UserIteration.iterationId,
      userId: UserIteration.userId,
    },
  };
  request_json(API.POST_RMS, { body: myBody });
  getUserIterationInfo(dispatcher, project_id);
};

export {
  getIRListInfo,
  createIRInfo,
  updateIRInfo,
  deleteIRInfo,
  updateServiceInfo,
  doUpdateServiceInfo,
  deleteServiceInfo,
  getSRListInfo,
  createSRInfo,
  updateSRInfo,
  deleteSRInfo,
  getIRSRInfo,
  createIRSR,
  deleteIRSR,
  getIterationInfo,
  createIteration,
  updateIterationInfo,
  deleteIterationInfo,
  getUserIterationInfo,
  createUserIteration,
  deleteUserIteration,
  getSRIterationInfo,
  createSRIteration,
  deleteSRIteration,
};
