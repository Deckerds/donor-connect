import React, { FC } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Common.module.css';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

interface IPagination {
  total: number;
  handlePageClick: (selectedItem: { selected: number }) => void;
}

const Pagination: FC<IPagination> = ({ total, handlePageClick }) => {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<MdNavigateNext size={16} />}
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageCount={total}
      previousLabel={<MdNavigateBefore size={16} />}
      renderOnZeroPageCount={null}
      containerClassName={styles.pagination}
      activeClassName={styles.active}
      pageClassName={styles.pageItem}
      previousClassName={styles.prev}
      nextClassName={styles.next}
      pageLinkClassName={styles.pageLink}
    />
  );
};

export default Pagination;
