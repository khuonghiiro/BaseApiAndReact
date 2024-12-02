import useSWR from 'swr';
import { BaseService, useCustomSWR } from '@/shared/services';
import api from '@/shared/services/axios-custom';
class services extends BaseService {		
	GetDetail = () => {
        let type = 'introduction';
		const { data, error, isLoading, mutate } = useCustomSWR<any>([`api/cauhinh/public/gioithieu`, type], () => api.get(`api/cauhinh/public/gioithieu?type=${type}`));
		return {
			data,
			error,
			isLoading,
			mutate,
		};
	};
   
}
const trangGioiThieuServices = new services("api/cauhinh/public/gioithieu");
export { trangGioiThieuServices };
