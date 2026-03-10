const mongoose = require("mongoose");
const Course = require("../../models/Course");
const Category = require("../../models/Category");

const toPositiveInt = (value, fallback) => {
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed) || parsed < 1) {
		return fallback;
	}
	return parsed;
};

const toNumber = (value) => {
	if (value === undefined || value === null || value === "") {
		return null;
	}
	const numberValue = Number(value);
	return Number.isNaN(numberValue) ? null : numberValue;
};

const buildSortStage = (sortBy = "relevance", hasSearchText = false) => {
	switch (sortBy) {
		case "price_asc":
			return { price: 1, createdAt: -1 };
		case "price_desc":
			return { price: -1, createdAt: -1 };
		case "rating_desc":
			return { averageRating: -1, totalRatings: -1, createdAt: -1 };
		case "newest":
			return { createdAt: -1 };
		case "popular":
			return { studentsEnrolledCount: -1, createdAt: -1 };
		case "relevance":
		default:
			if (hasSearchText) {
				return { averageRating: -1, totalRatings: -1, createdAt: -1 };
			}
			return { createdAt: -1 };
	}
};

exports.searchCourses = async (req, res) => {
	try {
		const page = toPositiveInt(req.query.page, 1);
		const limit = Math.min(toPositiveInt(req.query.limit, 12), 50);
		const skip = (page - 1) * limit;

		const query = (req.query.q || "").trim();
		const category = req.query.category;
		const tags = (req.query.tags || "")
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);

		const minPrice = toNumber(req.query.minPrice);
		const maxPrice = toNumber(req.query.maxPrice);
		const minRating = toNumber(req.query.minRating);

		const matchStage = {
			status: "Published",
		};

		if (category && mongoose.Types.ObjectId.isValid(category)) {
			matchStage.category = new mongoose.Types.ObjectId(category);
		}

		if (minPrice !== null || maxPrice !== null) {
			matchStage.price = {};
			if (minPrice !== null) {
				matchStage.price.$gte = minPrice;
			}
			if (maxPrice !== null) {
				matchStage.price.$lte = maxPrice;
			}
		}

		if (minRating !== null) {
			matchStage.averageRating = { $gte: minRating };
		}

		if (tags.length > 0) {
			matchStage.tag = { $in: tags };
		}

		if (query) {
			matchStage.$or = [
				{ courseName: { $regex: query, $options: "i" } },
				{ courseDescription: { $regex: query, $options: "i" } },
				{ tag: { $elemMatch: { $regex: query, $options: "i" } } },
			];
		}

		const sortStage = buildSortStage(req.query.sortBy, Boolean(query));

		const [searchResult, categories, availableTags] = await Promise.all([
			Course.aggregate([
				{ $match: matchStage },
				{
					$addFields: {
						studentsEnrolledCount: {
							$size: { $ifNull: ["$studentsEnrolled", []] },
						},
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "instructor",
						foreignField: "_id",
						as: "instructor",
					},
				},
				{
					$unwind: {
						path: "$instructor",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$lookup: {
						from: "categories",
						localField: "category",
						foreignField: "_id",
						as: "category",
					},
				},
				{
					$unwind: {
						path: "$category",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						courseName: 1,
						courseDescription: 1,
						thumbnail: 1,
						price: 1,
						tag: 1,
						averageRating: { $ifNull: ["$averageRating", 0] },
						totalRatings: { $ifNull: ["$totalRatings", 0] },
						studentsEnrolledCount: 1,
						createdAt: 1,
						instructor: {
							_id: "$instructor._id",
							firstName: "$instructor.firstName",
							lastName: "$instructor.lastName",
							image: "$instructor.image",
						},
						category: {
							_id: "$category._id",
							name: "$category.name",
						},
					},
				},
				{ $sort: sortStage },
				{
					$facet: {
						data: [{ $skip: skip }, { $limit: limit }],
						metadata: [{ $count: "totalCount" }],
					},
				},
			]),
			Category.find().select("_id name").lean(),
			Course.distinct("tag", { status: "Published" }),
		]);

		const data = searchResult?.[0]?.data || [];
		const totalCount = searchResult?.[0]?.metadata?.[0]?.totalCount || 0;
		const totalPages = Math.ceil(totalCount / limit) || 1;

		return res.status(200).json({
			success: true,
			data,
			pagination: {
				page,
				limit,
				totalCount,
				totalPages,
			},
			filters: {
				categories,
				tags: availableTags.filter(Boolean).sort(),
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not search courses",
			error: error.message,
		});
	}
};
