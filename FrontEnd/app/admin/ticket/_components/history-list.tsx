"use client";
import { useEffect, useState } from "react";
import { ticketServices } from "../services";
import { List, Typography } from "antd";
import { ApiUrl } from "@/public/app-setting";
import {
  formatFullDateTime,
} from "@/lib/common";
import { EActionTicketHistory } from "../ticket-status-enum";
import ImportMessagegPopup from "../../(quantrihethong)/chatuser/_components/import-messsage-popup";
const { Title, Link, Text } = Typography;
export const HistoryList = ({ ticketId }: {
  ticketId: number;
}) => {
  const { data, isLoading, mutate } = ticketServices.GetListHistory(ticketId);
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
  }, [ticketId]);
  function renderFile(fileNew: any, fileOld: any): import("react").ReactNode {
    const objectNew = JSON.parse(fileNew);
    const objectOld = JSON.parse(fileOld);
    return (<tr>
      <td>File đính kèm</td>
      <td>{objectOld && objectOld.length > 0 && <ul
      >
        {objectOld.map((item: any, index: number) => {
          return <li key={index}>{item?.title}</li>
        })}
      </ul>}</td>
      <td>{objectNew && objectNew.length > 0 && <ul
      >
        {objectNew.map((item: any, index: number) => {
          return <li key={index}>{item?.title}</li>
        })}
      </ul>}</td>
    </tr >)

  }
  const onDownload = async (file: any) => {
    let a = document.createElement("a");
    a.href = ApiUrl + "fileupload/api/file/download/" + file.guiid;
    a.target = "_blank";
    a.click();
  };

  const onClickUser = (selectUser: any) => {
    setUserId(selectUser.createdUserId);
  }

  return (
    data?.data &&
    <div>
      <List
        itemLayout="horizontal"
        dataSource={data?.data}
        renderItem={(item: any) => (
          <List.Item style={{ display: 'block' }}>
            <div>
              <Link 
              className="mr-2"
              onClick={()=>onClickUser(item)}>
                {item?.author}
              </Link>
              <Text style={{ textTransform: 'lowercase' }}>{item?.actionName} - {formatFullDateTime(item.createdDate)}</Text></div>
            {item.content && <div>{item.content}</div>}
            {(item.action == EActionTicketHistory.ChinhSua || item.action == EActionTicketHistory.ChinhSua_Gui) && item.objectNew && item.objectOld && <div>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th >Trường dữ liệu</th>
                    <th style={{ width: '40%' }}>Nội dung cũ</th>
                    <th style={{ width: '40%' }}>Nội dung mới</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    item.objectNew?.summary != item.objectOld?.summary &&
                    <tr>
                      <td>Tiêu đề</td>
                      <td>{item.objectOld?.summary}</td>
                      <td>{item.objectNew?.summary}</td>
                    </tr>
                  }
                  {
                    item.objectNew?.priorityName != item.objectOld?.priorityName &&
                    <tr>
                      <td>Độ ưu tiên</td>
                      <td>{item.objectOld?.priorityName}</td>
                      <td>{item.objectNew?.priorityName}</td>
                    </tr>
                  }
                  {
                    item.objectNew?.attachment != item.objectOld?.attachment && renderFile(item.objectNew?.attachment, item.objectOld?.attachment)
                  }

                </tbody>
              </table>
            </div>}
          </List.Item>
        )}
      />
      <ImportMessagegPopup selectUserId={userId}/>
    </div>
  );
}
