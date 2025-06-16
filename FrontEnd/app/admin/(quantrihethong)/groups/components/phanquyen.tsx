"use client";
import { Tree, TreeDataNode } from 'antd';
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { toast } from "react-toastify";
import React, { useEffect, useState, useReducer, Key, forwardRef, useRef, LegacyRef } from "react";
import { groupsServices } from "../services";
import TreeView from '@/shared/components/tree-view/tree-view';
import PerForm from './per-form';
import { DataNode } from 'antd/es/tree';

const PhanQuyenGroup = forwardRef<HTMLDivElement, IFormProps>(({ show, action, id, onClose }, ref) => {
  const { data: dataGroup } = groupsServices.GetById(id!);
  const { data, isLoading } = groupsServices.GetTreeCategory(id!);
  const [role, setRole] = useState<any>(null);

  useEffect(() => {
    // Đây là nơi bạn có thể cập nhật dữ liệu khi `id` thay đổi
  }, [id]);

  const onSelectNode = (data: any) => {
    if (data.isRoot) {
      setRole(data); // Cập nhật trạng thái role
    } else {
      setRole(null); // Reset role khi chọn không phải là role
    }
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
              <div ref={ref}>
                {!isLoading && (
                  // <Tree
                  //   style={{ background: '#f5ebeb' }}
                  //   showLine={true}
                  //   showIcon={false}
                  //   onSelect={onSelect}
                  //   // defaultExpandAll
                  //   treeData={[]}
                  // />
                  <TreeView
                    nodes={data} 
                    mapFields={{
                         idField: 'id',
                         titleField: 'title',
                         keyField: 'key',
                         isRootField: 'isRole',
                         childrenField: 'children',
                       }}
                    onSelect = {onSelectNode}
                  />
                )}
              </div>
            </div>
            <div className="col-span-8">
              <strong>Chức năng: {role?.title}</strong>
              <hr></hr>
              {role && <PerForm roleid={role?.id} groupid={id} />}
            </div>
          </Modal.Body>
          <Modal.Footer onClose={onClose}></Modal.Footer>
        </>
      </Modal>
    </>
  );
});

export default React.memo(PhanQuyenGroup);
