"use client";
import { Tree } from 'antd';
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { toast } from "react-toastify";
import React, { useEffect, useState, useReducer, Key } from "react";
import { groupsServices } from "../services";
import dynamic from 'next/dynamic';
const PerForm = dynamic(() => import('./per-form'))

export default function PhanQuyenGroup({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const { data: dataGroup } = groupsServices.GetById(id!);
  const { data, isLoading } = groupsServices.GetTreeCategory(id!);
  const [role, setRole] = useState(null);
  useEffect(() => {
  }, [id]);
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    if (info.node.isRole) {
      setRole(info.node);
    }
    else setRole(null);
    console.log('selected', selectedKeys, info);
  };


  return (
    <>
      <Modal show={show} size="xl" loading={isLoading}>
        <>
          <Modal.Header onClose={onClose}>Phân quyền nhóm: {dataGroup?.title}</Modal.Header>
          <Modal.Body nameClass="gap-4 grid-cols-12">
            <div className="col-span-4" style={{ background: '#f5ebeb' }}>
              <strong>Danh sách chức năng</strong>
              <hr></hr>
              <div >
                {
                  !isLoading && <Tree style={{ background: '#f5ebeb' }}
                    showLine={true}
                    showIcon={false}
                    onSelect={onSelect}
                    //defaultExpandAll
                    treeData={data}
                  />
                }
              </div>

            </div>
            <div className="col-span-8">
              <strong>Chức năng: {role?.title}</strong>
              <hr></hr>
              {
                role && <PerForm roleid={role?.id} groupid={id} />
              }

            </div>
          </Modal.Body>
          <Modal.Footer onClose={onClose}>

          </Modal.Footer>
        </>
      </Modal>
    </>
  );
}
