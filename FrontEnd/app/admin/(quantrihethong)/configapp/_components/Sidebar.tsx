import { Button, Col, Row, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import React from 'react';

export const Sidebar = ({ data }: any) => {
  const onDragStart = (event: any, node: any) => {
    event.dataTransfer.setData('application/reactflow', node.value);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <div className="sidebar_event">
      <Tabs defaultActiveKey="0" tabPosition={'right'}
      >
        <TabPane tab="NAVIGATION" key={0} style={{ padding: '0px !important' }}>
          <Row>
            {
              data?.filter((x: { value: number; }) => x.value <= 6).map((item: any, index: number) => {
                return <Col span={24} key={`navigation_${index}`} className="p-1">
                  <div className="actevent" onDragStart={(event) => onDragStart(event, item)} draggable>
                    {item.label}
                  </div>
                </Col>
              })
            }
          </Row>
        </TabPane>
        <TabPane tab="MOUSE" key={1} style={{ padding: '0px !important' }}>
          <Row>
            {
              data?.filter((x: { value: number; }) => x.value >= 7 && x.value <= 10).map((item: any, index: number) => {
                return <Col span={24} key={`navigation_${index}`} className="p-1">
                  <div className="actevent" onDragStart={(event) => onDragStart(event, item)} draggable>
                    {item.label}
                  </div>
                </Col>
              })
            }
          </Row>
        </TabPane>
        <TabPane tab="KEYBOARD" key={2} style={{ padding: '0px !important' }}>
          <Row>
            {
              data?.filter((x: { value: number; }) => x.value >= 11 && x.value <= 12).map((item: any, index: number) => {
                return <Col span={24} key={`navigation_${index}`} className="p-1">
                  <div className="actevent" onDragStart={(event) => onDragStart(event, item)} draggable>
                    {item.label}
                  </div>
                </Col>
              })
            }
          </Row>
        </TabPane>
        <TabPane tab="DATA" key={3} style={{ padding: '0px !important' }}>
          <Row>
            {
              data?.filter((x: { value: number; }) => x.value >= 13 && x.value <= 32).map((item: any, index: number) => {
                return <Col span={24} key={`navigation_${index}`} className="p-1">
                  <div className="actevent" onDragStart={(event) => onDragStart(event, item)} draggable>
                    {item.label}
                  </div>
                </Col>
              })
            }
          </Row>
        </TabPane>
        <TabPane tab="OTHER" key={4} style={{ padding: '0px !important' }}>
          <Row>
            {
              data?.filter((x: { value: number; }) => x.value >= 33).map((item: any, index: number) => {
                return <Col span={24} key={`navigation_${index}`} className="p-1">
                  <div className="actevent" onDragStart={(event) => onDragStart(event, item)} draggable>
                    {item.label}
                  </div>
                </Col>
              })
            }
          </Row>
        </TabPane>
      </Tabs>

    </div>
  );
};
