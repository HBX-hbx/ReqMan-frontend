import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";
import React from "react";
import undefined_logo from "../../assets/undefined.svg";

const { SubMenu } = Menu;
const { Sider } = Layout;

interface SidebarState {
  isCollapsed: boolean;
}

class Sidebar extends React.Component<any, SidebarState> {
  constructor(props: never) {
    super(props);
    this.state = {
      isCollapsed: false,
    };
  }
  onCollapse(collapsed: boolean): void {
    this.setState((state) => ({
      ...this.state,
      isCollapsed: collapsed,
    }));
  }

  render() {
    return (
      <Sider
        collapsible
        collapsed={this.state.isCollapsed}
        onCollapse={(collapsed) => this.onCollapse(collapsed)}
      >
        <Menu defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9" icon={<FileOutlined />}>
            Files
          </Menu.Item>
          <Menu.Item key="10" icon={<AppleOutlined />}>
            glb nb!
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default Sidebar;
