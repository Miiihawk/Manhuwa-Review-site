import { reportRepository } from "../repositories/report.repository";
import { reviewRepository } from "../repositories/review.repository";
import { commentRepository } from "../repositories/comment.repository";
import { reviewService } from "./review.service";
import type { CreateReportInput } from "../validators/report.schema";

export class ReportService {
  async createReport(reporterId: number, input: CreateReportInput) {
    if (input.reviewId) {
      const review = await reviewRepository.findById(input.reviewId);
      if (!review) throw new Error("TARGET_NOT_FOUND");
    } else if (input.commentId) {
      const comment = await commentRepository.findById(input.commentId);
      if (!comment) throw new Error("TARGET_NOT_FOUND");
    }

    return reportRepository.create({
      reporterId,
      reason: input.reason,
      reviewId: input.reviewId,
      commentId: input.commentId,
    });
  }

  listReports() {
    return reportRepository.findAll();
  }

  async dismissReport(adminId: number, reportId: number) {
    const report = await reportRepository.findById(reportId);
    if (!report) throw new Error("REPORT_NOT_FOUND");
    return reportRepository.updateStatus(reportId, "DISMISSED", adminId);
  }

  async removeReportedContent(_adminId: number, reportId: number) {
    const report = await reportRepository.findById(reportId);
    if (!report) throw new Error("REPORT_NOT_FOUND");

    // Deleting the content cascade-deletes this report row too.
    if (report.reviewId) {
      const review = await reviewRepository.findById(report.reviewId);
      if (review) {
        await reviewRepository.delete(report.reviewId);
        await reviewService.recalcAverage(review.comicId);
      }
    } else if (report.commentId) {
      await commentRepository.delete(report.commentId);
    }

    return { removed: true };
  }

  countPending() {
    return reportRepository.countPending();
  }

  countResolvedBy(userId: number) {
    return reportRepository.countResolvedBy(userId);
  }
}

export const reportService = new ReportService();
