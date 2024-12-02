import useSWR from 'swr';
import { BaseService, useCustomSWR } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {		
	GetList = () => {
		const { data, error, isLoading, mutate } = useCustomSWR<any>(`api/thongkeadmin/thuongmai`, () => api.get(`api/thongkeadmin/thuongmai`));
		return {
			data,
			error,
			isLoading,
			mutate,
		};
	};
    GetListCongNghiep = () => {		
		const { data, isLoading } = useCustomSWR<any>(`api/thongkeadmin/congnghiep`, () => api.get(`api/thongkeadmin/congnghiep`));
		return {
			data,
			// error,
			isLoading,
			// mutate,
		};
	};
	
    GetListNangLuong = () => {		
		const { data, isLoading } = useCustomSWR<any>(`api/thongkeadmin/nangluong`, () => api.get(`api/thongkeadmin/nangluong`));
		return {
			data,
			// error,
			isLoading,
			// mutate,
		};
	};
}

const thongKeAdminServices = new services("api/thongkeadmin");
export { thongKeAdminServices };
