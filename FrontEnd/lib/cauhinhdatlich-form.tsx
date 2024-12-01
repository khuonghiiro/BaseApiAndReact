"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetSelectTreeCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { cauHinhDongBoServices } from "@/app/admin/(quantrihethong)/cauhinhdongbo/services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
import { TanetFormTime } from "@/lib";

interface CauHinhFormProps {
    type: number;
    database: string;
    show: boolean;
    action: string;
    id?: any | null;
    onClose: (isRefresh: boolean) => void;
}

export default function CauHinhDatLichForm(
    {
        type,
        database,
        show,
        action,
        id,
        onClose
    }: CauHinhFormProps) {

    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
    const { data, error, isLoading, mutate } = cauHinhDongBoServices.GetByType(type, database);
    const [loading, setLoading] = useState(false);
    const [cauHinhTimeType, setCauHinhTimeType] = useState(0);

    const dataDefault = {
        dataTable: "",
        cauHinhType: null,
        timeStart: "",
        timeEnd: "",
        dateWeekValues: [],
        cronString: ""
    };

    const schema = object({
        dataTable: string().trim().required("Cơ sở dữ liệu không được để trống"),
        cauHinhType: number().nullable().required("Loại cấu hình không được để trống").integer("Bạn phải nhập kiểu số nguyên"),
        timeStart: cauHinhTimeType == 1 ? string().required("Thời gian bắt đầu không được để trống") : string().required("Thời gian đồng bộ không được để trống"),
        timeEnd: cauHinhTimeType == 1 ? string().required("Thời gian kết thúc không được để trống") : string().nullable(),
        dateWeek: cauHinhTimeType == 1 ? number().required("Tần suất không được để trống").min(10, "Thời gian ít nhất là 10 phút").max(60, "Thời gian nhiều nhất là 60 phút")
            : (cauHinhTimeType == 2 ? string().required("Giờ trong tuần không được để trống")
                : (cauHinhTimeType == 3 ? string().required("Ngày trong tuần không được để trống")
                    : (cauHinhTimeType == 4 ? string().required("Ngày trong tháng không được để trống")
                        : string().nullable()))),
        dateYear: cauHinhTimeType == 4 ? date().required("Ngày trong năm không được để trống") : date().nullable(),
    });

    const onSubmit = async (values: any) => {
        values.type = type;
        values.datatable = database;
        formatCronString(values);
        setLoading(true);
        if (data?.id) {
            try {
                await cauHinhDongBoServices.update(data?.id, values);
                toast.success("Cập nhật thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Cập nhật không thành công");
            }
        } else {
            try {
                await cauHinhDongBoServices.create(values);
                toast.success("Thêm thành công");
                await mutate();
                await onClose(true);
            } catch (err: any) {
                toast.error("Thêm mới không thành công");
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        setCauHinhTimeType(data?.cauHinhTimeType);
        dispatch({ type: action });
    }, [action, id, data]);

    const optionsHour = [
        { value: "00", label: "00:00 AM" },
        { value: "01", label: "01:00 AM" },
        { value: "02", label: "02:00 AM" },
        { value: "03", label: "03:00 AM" },
        { value: "04", label: "04:00 AM" },
        { value: "05", label: "05:00 AM" },
        { value: "06", label: "06:00 AM" },
        { value: "07", label: "07:00 AM" },
        { value: "08", label: "08:00 AM" },
        { value: "09", label: "09:00 AM" },
        { value: "10", label: "10:00 AM" },
        { value: "11", label: "11:00 AM" },
        { value: "12", label: "12:00 AM" },
        { value: "13", label: "01:00 PM" },
        { value: "14", label: "02:00 PM" },
        { value: "15", label: "03:00 PM" },
        { value: "16", label: "04:00 PM" },
        { value: "17", label: "05:00 PM" },
        { value: "18", label: "06:00 PM" },
        { value: "19", label: "07:00 PM" },
        { value: "20", label: "08:00 PM" },
        { value: "21", label: "09:00 PM" },
        { value: "22", label: "10:00 PM" },
        { value: "23", label: "11:00 PM" }
    ]

    const optionsWeek = [
        { value: "MON", label: "Thứ Hai" },
        { value: "TUE", label: "Thứ Ba" },
        { value: "WED", label: "Thứ Tư" },
        { value: "THU", label: "Thứ Năm" },
        { value: "FRI", label: "Thứ Sáu" },
        { value: "SAT", label: "Thứ Bảy" },
        { value: "SUN", label: "Chủ Nhật" }
    ]

    const optionsMonth = [
        { value: "01", label: "Ngày 1" },
        { value: "02", label: "Ngày 2" },
        { value: "03", label: "Ngày 3" },
        { value: "04", label: "Ngày 4" },
        { value: "05", label: "Ngày 5" },
        { value: "06", label: "Ngày 6" },
        { value: "07", label: "Ngày 7" },
        { value: "08", label: "Ngày 8" },
        { value: "09", label: "Ngày 9" },
        { value: "10", label: "Ngày 10" },
        { value: "11", label: "Ngày 11" },
        { value: "12", label: "Ngày 12" },
        { value: "13", label: "Ngày 13" },
        { value: "14", label: "Ngày 14" },
        { value: "15", label: "Ngày 15" },
        { value: "16", label: "Ngày 16" },
        { value: "17", label: "Ngày 17" },
        { value: "18", label: "Ngày 18" },
        { value: "19", label: "Ngày 19" },
        { value: "20", label: "Ngày 20" },
        { value: "21", label: "Ngày 21" },
        { value: "22", label: "Ngày 22" },
        { value: "23", label: "Ngày 23" },
        { value: "24", label: "Ngày 24" },
        { value: "25", label: "Ngày 25" },
        { value: "26", label: "Ngày 26" },
        { value: "27", label: "Ngày 27" },
        { value: "28", label: "Ngày 28" },
        { value: "29", label: "Ngày 29" },
        { value: "30", label: "Ngày 30" },
        { value: "31", label: "Ngày 31" }
    ]

    const formatCronString = (values: any) => {

        // format date week

        if (values.cauHinhTimeType == 2 || values.cauHinhTimeType == 3 || values.cauHinhTimeType == 4) {
            let dateWeekString = '';
            if (values.dateWeekValues) {
                for (let i = 0; i < values.dateWeekValues.length; i++) {
                    dateWeekString += i === 0 ? `${values.dateWeekValues[i]}` : `,${values.dateWeekValues[i]}`;
                }
                dateWeekString += ',';
            }
            dateWeekString = dateWeekString.slice(0, -1);
            dateWeekString += '';
            values.dateWeek = dateWeekString;
        }

        // format cron string

        let hh = values.timeStart?.substring(0, 2);
        let hh_end = values.timeEnd?.substring(0, 2);
        let hh_end_int = (parseInt(hh_end, 10) - 1).toString();
        if (parseInt(hh_end_int, 10) < 10) {
            hh_end_int = "0" + hh_end_int;
        }
        let mm = values.timeStart?.substring(3, 5);
        let dd = values.dateYear?.toString().substring(8, 10);
        let MM = values.dateYear?.toString().substring(5, 7);
        let yy = values.dateYear?.toString().substring(0, 4);

        if (values.cauHinhTimeType == 1) { // Hàng ngày
            values.cronString = "0 0/" + values.dateWeek + " " + hh + "-" + hh_end_int + " * * ?";
        } else if (values.cauHinhTimeType == 2) { // Theo giờ
            values.cronString = "0 0 " + values.dateWeek.replace(/["']/g, "") + " * * ?";
        } else if (values.cauHinhTimeType == 3) { // Hàng tuần 
            values.cronString = "0 " + mm + " " + hh + " * * " + values.dateWeek.replace(/["']/g, "");
        } else if (values.cauHinhTimeType == 4) { // Hàng tháng
            values.cronString = "0 " + mm + " " + hh + " " + values.dateWeek.replace(/["']/g, "") + " * ?";
        } else if (values.cauHinhTimeType == 5) { // Hàng năm
            values.cronString = "0 " + mm + " " + hh + " " + dd + " " + MM + " * " + yy;
        }
    }

    return (
        <>
            <Modal show={show} size="xl" loading={loading}>
                <Formik
                    onSubmit={(values) => {
                        onSubmit(values);
                    }}
                    validationSchema={schema}
                    initialValues={data ? data : dataDefault}
                    enableReinitialize={true}
                >
                    {({ handleSubmit }) => (
                        <Form noValidate
                            onSubmit={handleSubmit}
                            onKeyPress={(ev) => {
                                ev.stopPropagation();
                            }}>
                            <Modal.Header onClose={onClose}>Cấu hình đặt lịch</Modal.Header>
                            <Modal.Body nameClass="grid-cols-12">
                                <div className="col-span-6">
                                    <TanetSelect
                                        label="Loại cấu hình đồng bộ"
                                        required={true}
                                        options={[
                                            { value: 1, label: "Đồng bộ hàng ngày" },
                                            { value: 2, label: "Đồng bộ theo giờ" },
                                            { value: 3, label: "Đồng bộ hàng tuần" },
                                            { value: 4, label: "Đồng bộ hàng tháng" },
                                            { value: 5, label: "Đồng bộ hàng năm" },
                                        ]}
                                        id="cauHinhTimeType"
                                        name="cauHinhTimeType"
                                        onChange={(e: any) => {
                                            setCauHinhTimeType(e.target.value);
                                        }}
                                    />
                                </div>
                                <>
                                    {
                                        cauHinhTimeType == 1
                                            ?
                                            <>
                                                <div className="col-span-6">
                                                    <TanetSelect
                                                        label="Thời gian bắt đầu"
                                                        required={true}
                                                        view={state?.viewMode}
                                                        options={optionsHour}
                                                        id="timeStart"
                                                        name="timeStart"
                                                    />
                                                </div>
                                                <div className="col-span-6">
                                                    <TanetSelect
                                                        label="Thời gian kết thúc"
                                                        required={true}
                                                        view={state?.viewMode}
                                                        options={optionsHour}
                                                        id="timeEnd"
                                                        name="timeEnd"
                                                    />
                                                </div>
                                                <div className="col-span-6">
                                                    <TanetInput
                                                        label="Tần suất đồng bộ (phút)"
                                                        required={true}
                                                        id="dateWeek"
                                                        name="dateWeek"
                                                    />
                                                </div>
                                            </>
                                            :
                                            <>
                                                {
                                                    cauHinhTimeType == 2
                                                        ?
                                                        <>
                                                            <div className="col-span-6">
                                                                <TanetSelect
                                                                    label="Thời gian"
                                                                    required={true}
                                                                    view={state?.viewMode}
                                                                    options={optionsHour}
                                                                    name="dateWeekValues"
                                                                    isMulti
                                                                />
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            {
                                                                cauHinhTimeType == 3
                                                                    ?
                                                                    <>
                                                                        <div className="col-span-6">
                                                                            <TanetFormTime
                                                                                label="Thời gian đồng bộ"
                                                                                required={true}
                                                                                id="timeStart"
                                                                                name="timeStart"
                                                                            />
                                                                        </div>
                                                                        <div className="col-span-6">
                                                                            <TanetSelect
                                                                                label="Ngày trong tuần"
                                                                                required={true}
                                                                                view={state?.viewMode}
                                                                                options={optionsWeek}
                                                                                name="dateWeekValues"
                                                                                isMulti
                                                                            />
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {
                                                                            cauHinhTimeType == 4
                                                                                ?
                                                                                <>
                                                                                    <div className="col-span-6">
                                                                                        <TanetFormTime
                                                                                            label="Thời gian đồng bộ"
                                                                                            required={true}
                                                                                            id="timeStart"
                                                                                            name="timeStart"
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-span-6">
                                                                                        <TanetSelect
                                                                                            label="Ngày trong tháng"
                                                                                            required={true}
                                                                                            view={state?.viewMode}
                                                                                            options={optionsMonth}
                                                                                            name="dateWeekValues"
                                                                                            isMulti
                                                                                        />
                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {
                                                                                        cauHinhTimeType == 5
                                                                                            ?
                                                                                            <>
                                                                                                <div className="col-span-6">
                                                                                                    <TanetFormTime
                                                                                                        label="Thời gian đồng bộ"
                                                                                                        required={true}
                                                                                                        id="timeStart"
                                                                                                        name="timeStart"
                                                                                                    />
                                                                                                </div>
                                                                                                <div className="col-span-6">
                                                                                                    <TanetFormDate
                                                                                                        label="Ngày trong năm"
                                                                                                        required={true}
                                                                                                        view={state?.viewMode}
                                                                                                        dateFormat="dd/MM/yyyy"
                                                                                                        formatOutput="yyyy-MM-dd"
                                                                                                        id="dateYear"
                                                                                                        name="dateYear"
                                                                                                    />
                                                                                                </div>
                                                                                            </>
                                                                                            :
                                                                                            <>
                                                                                            </>
                                                                                    }
                                                                                </>
                                                                        }
                                                                    </>
                                                            }
                                                        </>
                                                }
                                            </>
                                    }
                                </>
                            </Modal.Body>
                            <Modal.Footer onClose={onClose}>
                                {!state?.viewMode ? (
                                    <>
                                        <button
                                            data-modal-hide="large-modal"
                                            type="submit"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Lưu
                                        </button>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal >
        </>
    );
}
