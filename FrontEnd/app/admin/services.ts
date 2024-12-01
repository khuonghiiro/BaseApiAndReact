import useSWR from 'swr';
import { BaseService } from '@/shared/services';
import api from '@/shared/services/axios-custom';
import { Meta } from '@/shared/model';
class services extends BaseService {		
	GetList = () => {
		const { data, error, isLoading, mutate } = useSWR(`api/thongkeadmin/thuongmai`, () => api.get(`api/thongkeadmin/thuongmai`));
		return {
			data,
			error,
			isLoading,
			mutate,
		};
	};
    GetListCongNghiep = () => {		
		const { data, isLoading } = useSWR(`api/thongkeadmin/congnghiep`, () => api.get(`api/thongkeadmin/congnghiep`));
		return {
			data,
			// error,
			isLoading,
			// mutate,
		};
	};
	
    GetListNangLuong = () => {		
		const { data, isLoading } = useSWR(`api/thongkeadmin/nangluong`, () => api.get(`api/thongkeadmin/nangluong`));
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
