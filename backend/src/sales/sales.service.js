/**
 * Services Logics related to Sale
 * Service/Repository 레이어의 함수를 호출해야합니다.
 */
const SalesRepository = require('./sales.repository');
const salesRepository = new SalesRepository();

const ItemsRepository = require('../items/items.repository');
const itemsRepository = new ItemsRepository();

const connection = require('../../config/connection').promise();

class SalesService {

	async createSales(data) {
		await salesRepository.createSales(data);
		return {
			statusCode: 201,
			responseBody: {
				result: 'success'
			}
		};
	}

	async getSales(token_id) {
		const data = await salesRepository.getSalesByTokenId(token_id);
		return {
			statusCode: 200,
			responseBody: {
				result: 'success',
				data: data[0]
			}
		};
	}

	async completeSales(token_id, buyer_address) {
		try {
			await connection.beginTransaction();

			await salesRepository.completeSales(token_id, buyer_address);
			await itemsRepository.updateItemOwnerAddress(token_id, buyer_address);

			await connection.commit();
			return {
				statusCode: 201,
				responseBody: {
					result: 'success'
				}
			};
		} catch(e) {
			await connection.rollback();
			throw e;
		}
	}

	/**
	 * PJT Ⅲ 과제 3: 
	 * Req.3-B2 판매 취소
	 */
	async deleteSales(saleId) {
		return {
			statusCode: 201,
			responseBody: {
				result: 'success'
			}
		};
	}

}

module.exports = SalesService;