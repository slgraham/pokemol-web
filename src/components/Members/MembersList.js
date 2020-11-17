import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/core';

import { useMembers } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { defaultMembers } from '../../utils/constants';
import MemberListCard from './MemberListCard';
import TextBox from '../Shared/TextBox';
import ContentBox from '../Shared/ContentBox';
import MemberSort from './MembersSort';

const MembersList = ({ handleSelect, selectedMember }) => {
  const [theme] = useTheme();
  const [members] = useMembers();
  const [listMembers, setListMembers] = useState(defaultMembers);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sort, setSort] = useState();

  useEffect(() => {
    if (members.length > 0) {
      sortMembers();
      setIsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, sort]);

  const sortMembers = () => {
    const sortedMembers = members;

    console.log('sort on', sort);

    if (sort) {
      sortedMembers.sort((a, b) => {
        if (sort.value === 'joinDateAsc') {
          return +a.createdAt - +b.createdAt;
        } else if (sort.value === 'joinDateDesc') {
          return +b.createdAt - +a.createdAt;
        } else {
          return +b[sort.value] - +a[sort.value];
        }
      });
    }

    setListMembers([...sortedMembers]);
  };

  return (
    <>
      <Flex>
        <MemberSort sort={sort} setSort={setSort} />
      </Flex>
      <ContentBox mt={6} mr={6}>
        <Flex>
          <TextBox w='43%'>{theme.daoMeta.member}</TextBox>
          <TextBox w='15%'>Shares</TextBox>
          <TextBox w='15%'>Loot</TextBox>
          <TextBox>Join Date</TextBox>
        </Flex>
        {listMembers.map((member) => {
          return (
            <MemberListCard
              key={member.id}
              member={member}
              isLoaded={isLoaded}
              handleSelect={handleSelect}
              selectedMember={selectedMember}
            />
          );
        })}
      </ContentBox>
    </>
  );
};

export default MembersList;
